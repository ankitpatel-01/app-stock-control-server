import { Body, Controller, Post, Get, ClassSerializerInterceptor, UseInterceptors, Param, ParseIntPipe } from '@nestjs/common';
import { Public } from 'src/common/decorator';
import { SignUpDto } from './dto/sign-up.dto';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { CompanyType } from './entities/company-type.entity';
import { CompanyService } from './company.service';
import { CompanyBranch } from './entities/company-branch-master.entity';
import { GetCompanyId } from 'src/common/decorator/get-current-company-id.decorator';

@Controller('company')
@ApiTags('Company Master')
@ApiSecurity('access-key')
export class CompanyController {


    constructor(private _companyService: CompanyService) { }

    @UseInterceptors(ClassSerializerInterceptor)
    @Public()
    @Get('type')
    getAllCategory(): Promise<ResponseDto<CompanyType[]>> {
        return this._companyService.getAllCompanyType();
    }

    @Public()
    @Post('signup')
    signUpNewComapny(@Body() signUpDto: SignUpDto) {
        return this._companyService.signUpNewComapny(signUpDto);
    }

    @Get('company-branch')
    getCompanyBranches(@GetCompanyId() cmpdbId: number): Promise<ResponseDto<CompanyBranch[]>> {
        return this._companyService.getCompanyBranchesList(cmpdbId);
    }

    @Get('details/:id')
    getCompanyDetails(@Param('id', ParseIntPipe) id: number) {
        return this._companyService.findCompanyDetailsId(id);
    }
}
