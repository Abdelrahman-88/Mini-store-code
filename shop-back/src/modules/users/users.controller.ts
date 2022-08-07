import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, Res, HttpCode, UseGuards, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerOptions } from 'src/services/upload/upload.service';
import { LoginDto } from './dto/login.dto';
import { hasRoles } from './../../auth/decorators/roles.decorator';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from './entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { idDto } from './dto/id.dto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { ResetLinkDto } from './dto/resetLink.dto';
import { ChangePasswordDto } from './dto/changePassword.dto';
import { GoogleDto } from './dto/google.dto';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiConsumes('multipart/form-data')
  @Post('/register')
  @UseInterceptors(FileInterceptor('profilePic',multerOptions))
  create(@UploadedFile() file: Express.Multer.File,@Body() createUserDto: CreateUserDto):Promise<object> {
    return this.usersService.create(file,createUserDto);
  }

  @Get('/file/:fileName')
  displayDocument(@Res() res: any,@Param('fileName') fileName: string):Promise<any> {
    return this.usersService.displayDocument(res,fileName);
  }

  @Get('/verify/:token')
  verify(@Param('token')token:string):Promise<object>{
    return this.usersService.verify(token);
  }

  @Get('/reset/:token')
  reset(@Param('token')token:string):Promise<object>{
    return this.usersService.reset(token);
  }

  @Post('/resetLink')
  resetLink(@Body() resetLinkDto: ResetLinkDto):Promise<object> {
    return this.usersService.resetLink(resetLinkDto);
  }

  @Get('/reSend/:id')
  @UsePipes(ValidationPipe)
  resendVerificationLink(@Param() userId: idDto):Promise<object>{
    const {id}=userId   
    return this.usersService.resendVerificationLink(id);
  }

  @HttpCode(200)
  @Post('/logIn')
  logIn(@Body() logInDto:LoginDto):Promise<object> {
    return this.usersService.logIn(logInDto);
  }

  // @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/updateProfile/:id')
  @ApiBearerAuth('access-token')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('profilePic',multerOptions))
  @UsePipes(ValidationPipe)
  updateProfile(@Param() userId: idDto,@Req() req: any,@UploadedFile() file: Express.Multer.File,@Body() updateUserDto: UpdateUserDto):Promise<object> { 
    const {id}=userId   
    return this.usersService.updateProfile(id,req,file,updateUserDto);
  }

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/updatePassword/:id')
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  updatePassword(@Param() userId: idDto,@Req() req: any,@Body()updatePasswordDto:UpdatePasswordDto) : Promise<object>{
    const {id}=userId   
    return this.usersService.updatePassword(id,req,updatePasswordDto);
  }

  @hasRoles(UserRole.USER)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Patch('/changePassword/:id')
  @ApiBearerAuth('access-token')
  @UsePipes(ValidationPipe)
  changePassword(@Param() userId: idDto,@Req() req: any,@Body()changePasswordDto:ChangePasswordDto) : Promise<object>{
    const {id}=userId   
    return this.usersService.changePassword(id,req,changePasswordDto);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('google')
  @UsePipes(ValidationPipe)
  googleAuthRedirect(@Body() googleDto:GoogleDto) : Promise<object> {
    return this.usersService.googleLogin(googleDto);
  }
}
