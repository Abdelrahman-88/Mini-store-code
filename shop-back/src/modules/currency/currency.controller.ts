import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, UsePipes, ValidationPipe, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { hasRoles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guards';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { CurrencyService } from './currency.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { CreatedByDto } from './dto/createdBy.dto';
import { idDto } from './dto/id.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';

@ApiTags('Currency')
@Controller('currency')
export class CurrencyController {
  constructor(private readonly currencyService: CurrencyService) {}

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Post('/addCurrency/:createdBy')
  @UsePipes(ValidationPipe)
  create(@Param() adminId: CreatedByDto,@Req() req: any,@Body() createCurrencyDto: CreateCurrencyDto) : Promise<object> {
    const {createdBy}=adminId 
    return this.currencyService.create(req,createdBy,createCurrencyDto);
  }

  // @Get()
  findAll() {
    return this.currencyService.findAll();
  }

  @Get('/getCurrency')
  findOne() : Promise<object> {
    return this.currencyService.findOne();
  }

  @hasRoles(UserRole.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth('access-token')
  @Patch('/updateCurrency/:id')
  update(@Param() currencyId: idDto,@Body() updateCurrencyDto: UpdateCurrencyDto) : Promise<object> {
    const{id}=currencyId;
    return this.currencyService.update(id,updateCurrencyDto);
  }

  // @Delete(':id')
  remove(@Param('id') id: string) {
    return this.currencyService.remove(+id);
  }
}
