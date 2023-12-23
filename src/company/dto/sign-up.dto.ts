import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

export class AddressDetails {
  @IsNotEmpty()
  @IsString()
  address1: string;

  @IsOptional()
  @IsString()
  address2: string;

  @IsOptional()
  @IsString()
  address3: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  country_id: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  state_id: number;

  @IsNotEmpty()
  @IsString()
  city_name: string;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  pincode: number;

  constructor(data: any) {
    if (data) {
      this.address1 = data.address1;
      this.address2 = data.address2;
      this.address3 = data.address3;
      this.country_id = data.country_id;
      this.state_id = data.state_id;
      this.city_name = data.city_name;
      this.pincode = data.pincode;
    }
  }
}

export class ContactDetails {
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  mobile1: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => (value === '' ? null : value))
  mobile2: number | null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => (value === '' ? null : value))
  tel_no: number | null;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  @Transform(({ value }) => (value === '' ? null : value))
  fax_no: number | null;

  @IsNotEmpty()
  @IsString()
  email: string;

  @IsOptional()
  @IsString()
  website: string;

  constructor(data: any) {
    if (data) {
      this.mobile1 = data.mobile1;
      this.mobile2 = data.mobile2;
      this.tel_no = data.tel_no;
      this.fax_no = data.fax_no;
      this.email = data.email;
      this.website = data.website;
    }
  }
}

export class TaxationDetails {
  @IsNotEmpty()
  @IsString()
  pan_no: string;

  @IsNotEmpty()
  @IsString()
  gst_no: string;

  @IsNotEmpty()
  @IsString()
  cin_no: string;

  @IsOptional()
  @IsString()
  opening_date: string;

  @IsOptional()
  @IsString()
  to_date: string;

  @IsOptional()
  @IsString()
  from_date: string;

  constructor(data: any) {
    if (data) {
      this.pan_no = data.pan_no;
      this.gst_no = data.gst_no;
      this.cin_no = data.cin_no;
      this.opening_date = data.opening_date;
      this.to_date = data.to_date;
      this.from_date = data.from_date;
    }
  }
}

export class BankingDetails {
  @IsNotEmpty()
  @IsString()
  bank_name: string;

  @IsNotEmpty()
  @IsString()
  branch_name: string;

  @IsNotEmpty()
  @IsString()
  ifsc_code: string;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  account_no: number;

  constructor(data: any) {
    if (data) {
      this.bank_name = data.bank_name;
      this.branch_name = data.branch_name;
      this.ifsc_code = data.ifsc_code;
      this.account_no = data.account_no;
    }
  }
}

export class CompanyDetails {
  @IsNotEmpty()
  @IsString()
  company_name: string;

  @IsNotEmpty()
  @IsString()
  trading_name: string;

  @IsNotEmpty()
  @IsString()
  company_short_name: string;

  @IsNotEmpty()
  @IsNumber()
  company_type: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => AddressDetails)
  address_details: AddressDetails;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => ContactDetails)
  contact_details: ContactDetails;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => TaxationDetails)
  taxation_details: TaxationDetails;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => BankingDetails)
  bank_details: BankingDetails;

  constructor(data: any) {
    if (data) {
      this.company_name = data.company_name;
      this.trading_name = data.trading_name;
      this.company_type = data.company_type;
      this.company_short_name = data.company_short_name;
      this.address_details = new AddressDetails(data.address_details);
      this.contact_details = new ContactDetails(data.contact_details);
      this.taxation_details = new TaxationDetails(data.taxation_details);
      this.bank_details = new BankingDetails(data.bank_details);
    }
  }
}

export class UserDetails {
  @IsNotEmpty({
    message: "first name can't be empty",
  })
  @MaxLength(50, {
    message: "first name length can't be more 50 charater",
  })
  first_name: string;

  @IsOptional()
  @MaxLength(50, {
    message: "middle name length can't be more 50 charater",
  })
  middle_name: string;

  @IsNotEmpty({
    message: "last name can't be empty",
  })
  @MaxLength(50, {
    message: "last name length can't be more 50 charater",
  })
  last_name: string;

  @IsNotEmpty({
    message: "username can't be empty",
  })
  @MaxLength(50, {
    message: "username length can't be more 50 charater",
  })
  username: string;

  @IsNotEmpty({
    message: "password can't be empty",
  })
  @MaxLength(8, {
    message: "password length can't be more 8 charater",
  })
  password: string;

  constructor(data: any) {
    if (data) {
      this.first_name = data.first_name;
      this.middle_name = data?.middle_name;
      this.last_name = data.last_name;
      this.username = data.username;
      this.password = data.password;
    }
  }
}

export class SignUpDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => CompanyDetails)
  company_details: CompanyDetails;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => UserDetails)
  user_details: UserDetails;

  constructor(data: any) {
    if (data) {
      this.company_details = new CompanyDetails(data.company_details);
      this.user_details = new UserDetails(data.user_details);
    }
  }
}
