import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyType } from './entities/company-type.entity';
import { Repository } from 'typeorm/repository/Repository';
import { Company } from './entities/company-master.entity';
import { UsersService } from 'src/user/user.service';
import { ResponseDto } from 'src/shared/dto/response.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { SignUpUserDto } from 'src/user/dto/create-user.dto';
import { CompanyBranch } from './entities/company-branch-master.entity';

@Injectable()
export class CompanyService {

    constructor(
        @InjectRepository(CompanyType)
        private _comTypeRepository: Repository<CompanyType>,
        @InjectRepository(Company)
        private _comMasterRepository: Repository<Company>,
        @InjectRepository(CompanyBranch)
        private _comBranchMasterRepository: Repository<CompanyBranch>,

        private _usersService: UsersService) { }

    /**
    * Retrieves all company types with isActive = 1.
    * 
    * @returns {Promise<ResponseDto<CompanyType[]>>} The list of company types with a response message.
     * @throws {InternalServerErrorException} If there is an error retrieving the data from the database.
    */
    async getAllCompanyType(): Promise<ResponseDto<CompanyType[]>> {
        try {

            const query = this._comTypeRepository.createQueryBuilder('ctype')
                .where("ctype.isActive = 1");

            const data: CompanyType[] = await query.addOrderBy('ctype.id', "ASC").getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

    /**
    * Creates a new company and its branch along with a user account for the company.
    * 
    * @param {SignUpDto} signUpCompanyDto The signup DTO containing the new company, branch, and user details.
    * @returns {Promise<ResponseDto<number>>} A response DTO containing a message and a response number (1 or 2).
    * @throws {InternalServerErrorException} If there is an error creating the company, branch, or user in the database.
    */
    async signUpNewComapny(signUpCompanyDto: SignUpDto): Promise<ResponseDto<number>> {
        const { company_details, user_details } = signUpCompanyDto;
        const { address_details, contact_details, taxation_details, bank_details } = company_details;
        const compantType: CompanyType = await this.findCompanyTypeById(company_details.company_type)
        try {
            const NewCompany: Company = await this._comMasterRepository.create({
                company_name: company_details?.company_name,
                company_short_name: company_details?.company_short_name,
                trading_name: company_details?.trading_name,
                company_type: compantType,
                address1: address_details?.address1,
                address2: address_details?.address2 ? address_details.address2 : null,
                address3: address_details?.address3 ? address_details.address3 : null,
                country_id: address_details?.country_id,
                state_id: address_details?.state_id,
                city: address_details?.city_name,
                pinCode: address_details?.pincode,
                mobile1: contact_details?.mobile1,
                mobile2: contact_details?.mobile2,
                tel_no: contact_details?.tel_no,
                fax_no: contact_details?.fax_no,
                email: contact_details?.email,
                website: contact_details.website,
                pan_no: taxation_details?.pan_no,
                gst_no: taxation_details?.gst_no,
                cin_no: taxation_details?.cin_no,
                opening_date: taxation_details?.opening_date,
                from_date: taxation_details?.from_date,
                to_date: taxation_details?.to_date,
                bank_name: bank_details?.bank_name,
                bank_branch_name: bank_details?.branch_name,
                ifsc_code: bank_details?.ifsc_code,
                account_no: bank_details?.account_no,
            })

            const savedComapny = await this._comMasterRepository.save(NewCompany);

            const newCompanyBranch: CompanyBranch = await this._comBranchMasterRepository.create({
                name: company_details?.company_name,
                address1: address_details?.address1,
                address2: address_details?.address2,
                address3: address_details?.address3,
                country_id: address_details?.country_id,
                state_id: address_details?.state_id,
                city: address_details?.city_name,
                pinCode: address_details?.pincode,
                mobile1: contact_details?.mobile1,
                mobile2: contact_details?.mobile2,
                tel_no: contact_details?.tel_no,
                fax_no: contact_details?.fax_no,
                email: contact_details?.email,
                website: contact_details.website,
                pan_no: taxation_details?.pan_no,
                gst_no: taxation_details?.gst_no,
                cin_no: taxation_details?.cin_no,
                opening_date: taxation_details?.opening_date,
                from_date: taxation_details?.from_date,
                to_date: taxation_details?.to_date,
                bank_name: bank_details?.bank_name,
                bank_branch_name: bank_details?.branch_name,
                ifsc_code: bank_details?.ifsc_code,
                account_no: bank_details?.account_no,
                company: savedComapny,
            })

            await this._comBranchMasterRepository.save(newCompanyBranch);


            const signUpUser: SignUpUserDto = {
                first_name: user_details?.first_name,
                middle_name: user_details?.middle_name,
                last_name: user_details?.last_name,
                username: user_details?.username,
                password: user_details?.password,
                companyId: savedComapny.company_id,
            }
            const res = this._usersService.signUpNewUser(signUpUser);
            if (res) {
                return {
                    message: "signup successful",
                    response: 1
                }
            } else {
                return {
                    message: "signup failed",
                    response: 2
                }
            }

        } catch (err) {
            throw new InternalServerErrorException(err)
        }

    }


    /**
    * Find a company type by its ID
    *
    * @param {number} id - The ID of the company type to find
    * @throws {BadRequestException} - If the provided ID is 0
    * @throws {NotFoundException} - If the company type with the provided ID is not found
   * @returns {Promise<CompanyType>} - A promise that resolves to the found company type
    */
    async findCompanyTypeById(id: number): Promise<CompanyType> {
        if (id == 0) {
            throw new BadRequestException();
        }
        const type: CompanyType = await this._comTypeRepository.findOne({
            where: {
                id,
                isActive: 1
            }
        });

        if (type) {
            return type;
        }

        throw new NotFoundException(`company type with id ${id} not found`);
    }

    /**
     * Find a company by its ID
     *
     * @param {number} id - The ID of the company to find
     * @throws {NotFoundException} - If the company with the provided ID is not found
     * @returns {Promise<Company>} - A promise that resolves to the found company
     */
    async findCompanyDetailsId(id: number): Promise<Company> {

        const company: Company = await this._comMasterRepository.findOne({
            where: {
                company_id: id,
                isActive: 1
            }
        });

        if (company) {
            return company;
        }

        throw new NotFoundException(`company with id ${id} not found`);
    }

    /**
     * Get a list of company branches by the company ID
     *
     * @param {number} id - The ID of the company to get the branches for
     * @throws {InternalServerErrorException} - If there is an error in the database query
     * @returns {Promise<ResponseDto<CompanyBranch[]>>} - A promise that resolves to an object containing the message and the response data
     */
    async getCompanyBranchesList(id: number): Promise<ResponseDto<CompanyBranch[]>> {
        try {

            const query = this._comBranchMasterRepository.createQueryBuilder('cb')
                .select(['cb.id', 'cb.name', 'cb.address1', 'cb.address2', 'cb.address3', 'cb.city'])
                .where("cb.isActive = 1")
                .andWhere(`cb.company_id = :id`, { id: id })
                .orderBy('cb.id', 'ASC');

            const data: CompanyBranch[] = await query.getMany();

            return {
                message: data.length == 0 ? 'No data found.' : 'data found sucessfully.',
                response: data,
            };

        } catch (err) {
            throw new InternalServerErrorException(err)
        }
    }

}
