import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
} from 'class-validator';
import { ValidatorUtils } from '../utils/validator-utils';
  
@ValidatorConstraint({ name: 'isCpfCnpj', async: false })
export class IsCpfCnpj implements ValidatorConstraintInterface {
    validate(cpfCnpj: string = '') {
        if (cpfCnpj.length === 11) {
            return ValidatorUtils.validateCPF(cpfCnpj);
        }
        return ValidatorUtils.validateCNPJ(cpfCnpj);
    }

    defaultMessage() {
        return 'CPF or CNPJ should be valid';
    }
}
