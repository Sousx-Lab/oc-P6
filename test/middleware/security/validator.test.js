const validator = require('../../../middleware/security/validator');

/**
 * Email validator
 */
describe('Email validator tests', () => {
    it('returns false if email is not a email valide', () => {
        expect(validator.isEmail('notValidEmail@domainCom')).toBe(false);
        expect(validator.isEmail('notValidEmaildomainCom')).toBe(false);
        expect(validator.isEmail('notValidEmaildomain.com')).toBe(false);
        expect(validator.isEmail(1245)).toBe(false);
        expect(validator.isEmail(['email@domain.com'])).toBe(false);
        expect(validator.isEmail({email: 'email@domain.com'})).toBe(false);
    });

    it('returns false if email is empty', () => {
        expect(validator.isEmail(' ')).toBe(false);       
    });

    it('returns true if email is valid', () => {
        expect(validator.isEmail("validemail@domain.com")).toBe(true);       
    });
});

/**
 * Password validator CNIL compliance 
 * check if eight characters minimum, 
 * at least one uppercase letter, one lowercase letter and one number
 */
describe('Password validator tests', () => {
    it('returns false if password no contain eight characters minimum', () => {
        expect(validator.isValidPassword('passrd')).toBe(false);
        expect(validator.isValidPassword('Passrd')).toBe(false);
        expect(validator.isValidPassword('Passwrd')).toBe(false);
    });

    it('returns false if password no contain at least one uppercase letter', () => {
        expect(validator.isValidPassword('password123')).toBe(false);
    })

    it('returns false if password no contain at least one lowercase letter', () => {
        expect(validator.isValidPassword('PASSWORD123')).toBe(false);
    })

    it('returns true if password is valid', () => {
        expect(validator.isValidPassword('Password123')).toBe(true);
    });
})

/**
 * Empty validator
 */
describe('Empty validator tests', () => {
    it('returns false if value is not empty', () => {
        expect(validator.isEmpty('empty')).toBe(false);
    });
    
    it('returns true if value is empty or no args ', () => {
        expect(validator.isEmpty(' ')).toBe(true);
        expect(validator.isEmpty()).toBe(true);
    });
})

