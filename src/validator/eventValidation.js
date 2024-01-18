import {check, validationResult} from 'express-validator'

const isTitleVlidate = [check('title').notEmpty().withMessage('Title is required')]

const isDescriptionValidate = [check('description').notEmpty().withMessage('Description is required')]

const isCategoryValidate = [check('category').notEmpty().withMessage('Category code is required')]

const isAgeRangeValidate = [check('age_range').notEmpty().withMessage('Age Range is required')]

const isIdValidate = [check('u_id').notEmpty().withMessage('User id is Required')]

const isLocationValidate = [check('location').notEmpty().withMessage('Location is required')]

const isParticipentsValidate = [check('participents').notEmpty().withMessage('Participents name is required')]

const isPhotosValidate = [check('photos').notEmpty().withMessage('Photos number is required')]

const isStartDateValidate = [check('start_date').notEmpty().withMessage('Date is required')]

const isEndDateValidate = [check('end_date').isLength({min: 8}).withMessage('EndDate must contains 8 letters or more')]

const isTimeValidate = [check('time').notEmpty().withMessage('Time is required')]

const isRequestValid = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.array().length > 0) {
        return res.status(200).json({status: false, message: errors.array()[0].msg})
    }
    next()
}

export {isTitleVlidate, isTimeValidate, isEndDateValidate, isStartDateValidate, isIdValidate, isPhotosValidate, isParticipentsValidate, isLocationValidate, isAgeRangeValidate, isCategoryValidate, isDescriptionValidate, isRequestValid}
