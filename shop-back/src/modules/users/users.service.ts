import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import mongoose, { Connection, Model, trusted } from 'mongoose';
import { MailService } from 'src/services/mail/mail.service';
import { confirmation, updateConfirmation, resetConfirmation } from 'src/services/mail/templates/confirmation';
import { PagesService } from 'src/services/pages/pages.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { lastValueFrom, map } from 'rxjs';
import { AuthService } from 'src/auth/service/auth/auth.service';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ResetLinkDto } from './dto/resetLink.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { google, Auth } from 'googleapis';
import { GoogleDto } from './dto/google.dto';
import { nanoid } from 'nanoid';


@Injectable()
export class UsersService {
  private fileModel: any;
  oauthClient: Auth.OAuth2Client;
  constructor(private mailService: MailService,private configService:ConfigService,@InjectModel(User.name) private readonly userModel:Model<User>,
  private pagesService:PagesService,private authService: AuthService,
  @InjectConnection() private readonly connection: Connection){
    this.fileModel = new mongoose.mongo.GridFSBucket(this.connection.db , {
      bucketName: "uploads"
  })
  const clientID = this.configService.get('GOOGLEClientID');
    const clientSecret = this.configService.get('GOOGLEClientSECRET');
 
    this.oauthClient = new google.auth.OAuth2(
      clientID,
      clientSecret
    );
  }

  async create(file: Express.Multer.File,createUserDto: CreateUserDto) : Promise<object> {
    try {
      let user:any;
      let subject = `Confirmation email`
      let {email,...value}=createUserDto
      email = email.toLocaleLowerCase()
      const emailExist = await this.userModel.findOne({email})
      if (emailExist) {
        return new BadRequestException('Email already exist')
      } else {
        if (file) {
          user = new this.userModel({email,...value,profilePic:file.filename});
       } else {
         user = new this.userModel({email,...value});
       }
       const newUser = await user.save();
       const{password,...rest} = newUser._doc;
       const {_id,role}=rest
       const data = {_id,role}
       const result = this.authService.generateJwt(data)
       const token = await lastValueFrom(result);     
       try {
        const info = await this.mailService.sendUserConfirmation(user, confirmation(token),subject);
        if (info.messageId) {
          return {message:"Register successfully please verify your email"};
         } else {
           return new InternalServerErrorException('Register successfully but faild to send verification email please try login after some time')
         }
       } catch (error) {
        return new InternalServerErrorException('Register successfully but faild to send verification email please try login after some time')
       }
      }
    } catch (error) {            
      return new InternalServerErrorException(error)
    }
  }

  async updateProfile(id: string,req:any,file: Express.Multer.File,updateUserDto: UpdateUserDto) : Promise<object> {
    try {
      let updatedUser;
      const user =req.user.user
      let {email,...value}=updateUserDto
      email = email.toLocaleLowerCase()
      const subject = `Confirmation email`
      const {_id,role}=user
      const data = {_id,role}      
      const emailExist = await this.userModel.findOne({email})
      if (emailExist) {
        if (email==user.email) {
          if (file) {
            updatedUser = await this.userModel.findOneAndUpdate({_id:id},{email,...value,profilePic:file.filename},{new:true}).select("-password")
          } else {
            updatedUser = await this.userModel.findOneAndUpdate({_id:id},{email,...value,profilePic:user.profilePic},{new:true}).select("-password")
          }
          if (updatedUser) {
            const result = this.authService.generateJwt(JSON.stringify(updatedUser))
            const token = await lastValueFrom(result); 
            return {message:"Profile updated successfully",token};
          } else {
            return new NotFoundException('Invalid User')
          }
        } else {
          return new BadRequestException('Email already exist')
        }
      } else {
        if (file) {
          updatedUser = await this.userModel.findOneAndUpdate({_id:id},{email,...value,verified:false,profilePic:file.filename},{new:true}).select("-password")
        } else {
          updatedUser = await this.userModel.findOneAndUpdate({_id:id},{email,...value,verified:false,profilePic:user.profilePic},{new:true}).select("-password")
        }
        if (updatedUser) {
          const result = this.authService.generateJwt(data)
          const token = await lastValueFrom(result); 
          try {
            const info = await this.mailService.sendUserConfirmation(updatedUser, updateConfirmation(token),subject);
            if (info.messageId) {
              return {message:"Profile updated successfully please verify your email"};
            } else {
               return new InternalServerErrorException('Profile updated successfully but faild to send verification email please try login after some time')
             }
           } catch (error) {
            return new InternalServerErrorException('Profile updated successfully but faild to send verification email please try login after some time')
           }
        } else {
          return new NotFoundException('Invalid User')
        }
      }
    } catch (error) {    
      return new InternalServerErrorException(error)
    }
  }

  async resetLink(resetLinkDto: ResetLinkDto) : Promise<object> {
    try {
      let {email}=resetLinkDto
      email = email.toLocaleLowerCase()
      const subject = `Confirmation email`   
      const emailExist = await this.userModel.findOne({email}).select('-password')
      if (emailExist) {
        const {_id,role}=emailExist
        const data = {_id,role}   
        const result = this.authService.generateJwt(JSON.stringify(data))
        const token = await lastValueFrom(result); 
        try {
          const info = await this.mailService.sendUserConfirmation(emailExist, resetConfirmation(token),subject);
          if (info.messageId) {
            return {message:"Password reseted successfully please verify your email"};
          } else {
             return new InternalServerErrorException('Faild to send verification email please try after some time')
           }
         } catch (error) {
          return new InternalServerErrorException('Faild to send verification email please try after some time')
         }
      } else {
        return new NotFoundException('Invalid Email')
      }
    } catch (error) {    
      return new InternalServerErrorException(error)
    }
  }

  async changePassword(id: string,req:any,changePasswordDto:ChangePasswordDto) : Promise<object>{
    try {
      const user = await this.userModel.findOne({_id:id,reset:true})
      if (user) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, salt);
        const update = await this.userModel.findOneAndUpdate({_id:id},{password:hashedPassword,reset:false,socialLogin:false},{new:true}).select('-password')
        const result = this.authService.generateJwt(update._doc)        
        const token = await lastValueFrom(result);
        return {message:"Password changed successfully",token}
      } else {
        return new NotFoundException('Invalid User')
      }
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async updatePassword(id: string,req:any,updatePasswordDto:UpdatePasswordDto) : Promise<object>{
    try {
      const user = await this.userModel.findOne({_id:id})
      if (user) {
        const isMatch = await bcrypt.compare(updatePasswordDto.oldPassword, user.password);
        if (isMatch) {
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, salt);
          const update = await this.userModel.findOneAndUpdate({_id:id},{password:hashedPassword})
          return {message:"Password updated successfully"}
        } else {
          return new BadRequestException('Invalid old password')
        }
      } else {
        return new NotFoundException('Invalid User')
      }
    } catch (error) {
      return new InternalServerErrorException(error)
    }
  }

  async displayDocument(res:any,fileName:string):Promise<any>{
    try {      
        const file = await this.userModel.findOne({profilePic:fileName});
        if (file) {
            let downloadStream = this.fileModel.openDownloadStreamByName(fileName);
            downloadStream = downloadStream.pipe(res)            
            downloadStream.on("data", function(data:any) {
              return data;
            });
        } else {
            let notFoundStream = this.fileModel.openDownloadStreamByName(this.configService.get('NOTFOUND'));
            notFoundStream = notFoundStream.pipe(res) 
            notFoundStream.on("data", function(data:any) {
              return data;
            });
        }
    } catch (error) {
      return new InternalServerErrorException(error)
    }
}

async verify(token:string) : Promise<object>{
  try {
    const id = this.authService.decodeJwt(token)
    const find = await this.userModel.findOne({_id:id})
    if (find) {
      if (find.verified) {
        return new BadRequestException('Email already verified')
      } else {
        const verify = await this.userModel.findOneAndUpdate({_id:id},{verified:true})
        if (verify) {
          return {message:'Email verified successfully'}
        } else {
          return new NotFoundException('Invalid user')
        }
      }
    } else {
      return new BadRequestException('Invalid user')
    }
  } catch (error) {
    return new InternalServerErrorException(error)
  }
}

async reset(token:string) : Promise<object>{
  try {
    const id = this.authService.decodeJwt(token)
    const find = await this.userModel.findByIdAndUpdate({_id:id},{reset:true})
    if (find) {
      return {message:'Password reseted successfully'}
    } else {
      return new BadRequestException('Invalid user')
    }
  } catch (error) {
    return new InternalServerErrorException(error)
  }
}

async resendVerificationLink(id:string) : Promise<object>{
  try {
    let subject = `Confirmation email`
    const user = await this.userModel.findOne({_id:id});
    if (user) {
       const {_id,role}=user
       const data = {_id,role}       
       const result = this.authService.generateJwt(data)
       const token = await lastValueFrom(result);     
       try {
        const info = await this.mailService.sendUserConfirmation(user, confirmation(token),subject);
        if (info.messageId) {
          return {message:"Verification email sent successfully"};
         } else {
           return new InternalServerErrorException('Faild to send verification email please try later')
         }
       } catch (error) {
        return new InternalServerErrorException('Faild to send verification email please try later')
       }
    } else {
      return new NotFoundException('Invalid user')
    }
  } catch (error) {    
    return new InternalServerErrorException(error)
  }
}

async logIn(logInDto:LoginDto) : Promise<object>{
  try {
   const user = await this.userModel.findOne({email:logInDto.email})
   if (user) {
     if (user.verified) {
       const isMatch = await bcrypt.compare(logInDto.password, user.password);
       if (isMatch) {
        const{password,...rest} = user._doc;
        return this.authService.generateJwt(rest).pipe(
          map((jwt: string) => {
            return {
              message:"Login successfully",
              token: jwt
            }
          })
        )
       } else {
        return new NotFoundException({error:"Invalid email or password"})
       }
     } else {
      const {_id,role} = user;
      const data = {_id,role};
      const result = this.authService.generateJwt(data)
      const token = await lastValueFrom(result);
      return new BadRequestException({error:"Unverified email",token})
     }
   } else {
    return new NotFoundException({error:"Invalid email or password"})
   }
  } catch (error) {
   return new InternalServerErrorException(error)
  } 
 }

 async googleLogin(googleDto:GoogleDto)  : Promise<object>{
  try {
    const {token,...rest} = googleDto    
    const tokenInfo = await this.oauthClient.getTokenInfo(token);
    if (tokenInfo) {
      let { email_verified, email } = tokenInfo
      email = email.toLowerCase()
      if (email_verified) {
        const user = await this.userModel.findOne({email}).select('-password')        
        if (user) {
          const result = this.authService.generateJwt(user._doc)
          const token = await lastValueFrom(result);
          return {
            message:"Login successfully",
            token
          }
        } else {
          const newUser = new this.userModel({email,...rest,verified:true,password:nanoid(),reset:true,socialLogin:true});
          const savedUser = await newUser.save();
          const{password,...value} = savedUser._doc;
          const result = this.authService.generateJwt(value)
          const token = await lastValueFrom(result);
          return {
            message:"Login successfully",
            token
          }
        }
      } else {
        return new NotFoundException({error:"No user from google"})
      }
    }else{
      return new NotFoundException({error:"No user from google"})
    }
  } catch (error) {    
    return new InternalServerErrorException(error)
  }
  
}

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
