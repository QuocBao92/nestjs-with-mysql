/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */
/**
 * RegisterUserExcerptNo
 */
export enum RegisterUserExcerptNo {

    // Conflict HAID
    ConflictHAID = 1,

    // If HaUserID not entered
    HaUserIDIsNotInput = 1,

    // If  HaUserID is not a string consisting of only alphanumeric characters
    HaUserIDisIncludeAlphanumericAlone = 1,

    // If HaUserID the number of characters is not 64
    HaUserIDIsNot64Characters = 1,

    // If not entered weight
    WeightBodyIsNotInput = 2,

    // If weight the format is not an integer.
    WeightBodyIsNotInteger = 2,

    // When a number other than 0 or 1 is specified.
    WeightBodyOtherThan0And1 = 2,

    // If  SmartPhone not entered.
    SmartPhoneIsNotInput = 3,

    // If SmartPhonethe format is not an integer
    SmartPhoneIsNotInteger = 3,

    // When a number other than 0 or 1 is specified.
    SmartPhoneOtherThan0and1 = 3,

    // If HaID not entered
    HaIDRegistrationIsNotInput = 4,

    // When the format is not "YYYY-MM-DD"
    HaIDRegistrationIsNotFrom = 4,

    // If a non-existent date is specified
    HaIDRegistrationDoNotExistIsSpecified = 4,

    // If a future date is specified
    HaIDRegistrationFutureIsSpecified = 4,

    // Patient contract information is invalid
    PatientContractIsAnInvalid = 4,
}

/**
 * UnregisterUserExcerptNo
 */
export enum UnregisterUserExcerptNo {
    None = 0,

    // If HaUserID not entered
    HaUserIDIsNotInput = 1,

    // If  HaUserID  not a string consisting of only alphanumeric characters
    HaUserIDisNotCharacterStringOfAlphanumericAlone = 1,

    // If HaUserID the number of characters is not 64
    HaUserIDIsNot64Characters = 1,

    // Conflict HAID
    ConflictHAID = 1,
}

/**
 * Enum for API getMedicalTime OHI
 */
export enum GetMedicalTimeOHIExcerptNo {
    // If HaUserID not entered
    HaUserIDIsNotInput = 1,

    // If  HaUserID is not a string consisting of only alphanumeric characters
    HaUserIDisIncludeAlphanumericAlone = 1,

    // If HaUserID the number of characters is not 64
    HaUserIDIsNot64Characters = 1,

    // If start_date is not entered
    StartDateIsNotInput = 2,

    // If start_date is invalid format
    StartDateIsNotADate = 2,

    // If a non-existent start_date is specified
    StartDateDoNotExistIsSpecified = 2,

    // If end_date is not entered
    EndDateIsNotInput = 3,

    // If end_date is invalid format
    EndDateIsNotADate = 3,

    // If a non-existent end_date is specified
    EndDateDoNotExistIsSpecified = 3,

    // When a value older than the acquisition period start date is specified on the acquisition period end date
    EndDateEarlierThanStartDate = 3,
}

export enum PatientListExcerptNo {
    // If type the format is not an integer
    TypeIsNotInteger = 1,

    // If type a value other than 1, 2 is specified
    TypeoOther1Or2 = 1,
}

export enum CommonError {

}

/**
 * BloodPressureDetailExcerptNo
 */
export enum BloodPressureDetailExcerptNo {
    None = 0,

    // If StartDate not entered
    StartDateIsNotInPut = 1,

    // If StartDate the format is not a date
    StartDateIsNotADate = 1,

    // If a non-existent date is specified
    StartDateDoNotExistIsSpecificed = 1,

    // if EndDate not entered
    EndDateIsNotInPut = 2,

    // If EndDate the format is not a date
    EndDateIsNotADate = 2,

    // If EndDate a non-existent date is specified
    EndDateDoNotExistIsSpecificed = 2,

    // When a value earlier than the acquisition period start date is specified on the acquisition period end date
    EndDateEarlierThanStartDate = 2,
}

/**
 * WeightDetailExcerptNo
 */
export enum WeightDetailExcerptNo {
    None = 0,
    // if StartDate not entered
    StartDateIsNotInPut = 1,

    // If StartDate the format is not a date
    StartDateIsNotADate = 1,

    // If a non-existent date is specified
    StartDateDoNotExistIsSpecificed = 1,

    // If EndDate not entered
    EndDateIsNotInPut = 2,

    // If EndDate the format is not a date
    EndDateIsNotADate = 2,

    // If EndDate the format is not a date
    EndDateDoNotExistIsSpecificed = 2,

    // When a value earlier than the acquisition period start date is specified on the acquisition period end date
    EndDateEarlierThanStartDate = 2,
}

/**
 * GetPersonalBloodPressureExcerptNo
 */
export enum GetPersonalBloodPressureExcerptNo {
    None = 0,
}

/**
 * SetPersonalBloodPressureExcerptNo
 */
export enum SetPersonalBloodPressureExcerptNo {

    // If Target systolic blood pressure not entered
    TargetSysIsNotInPut = 1,

    // If Target Systolic blood pressure the format is not an integer
    TargetSysIsNotInteger = 1,

    // If a number outside the range of [Target blood pressure setting lower limit]
    // to [Target blood pressure setting upper limit] is specified
    TargetSysOutsidetSpecifiedRange = 1,

    // If Diastolic blood pressure not entered
    TargetDiaIsNotInPut = 2,

    // If Diastolic blood pressure the format is not an integer
    TargetDiaIsNotInteger = 2,

    // When a number outside the range of [Target blood pressure setting lower limit] to
    // [Target blood pressure setting upper limit] is specified
    TargetDiaOutsidetSpecifiedRange = 2,

    // When a value larger than the systolic blood pressure is specified for the diastolic blood pressure
    TargetDiaLargerThanSys = 2,

    // If threshold systolic blood pressure not entered
    ThresholdSysIsNotInput = 3,

    // If threshold systolic blood pressure not entered
    ThresholdSysIsNotInteger = 3,

    // When a number outside the range from [systolic blood pressure setting lower limit]
    // to [systolic blood pressure setting upper limit] is specified
    ThresholdSysInvalid = 3,

    // When a value lower than the target systolic blood pressure is specified as the threshold systolic blood pressure
    ThresholdSysOutsidetSpecifiedRange = 3,

    // Threshold diastolic blood pressure is not input
    ThresholdDiaIsNotInput = 4,

    // If threshold Diastolic blood pressure the format is not an integer
    ThresholdDiaIsNotInteger = 4,

    // When a number out of the range from [Lowest blood pressure setting lower limit]
    // to [Lowest blood pressure setting upper limit] is specified
    ThresholdDiaOutsidetSpecifiedRange = 4,

    // When the target diastolic blood pressure is larger than the target systolic blood pressure
    ThresholdDiaLargerThanThresholdSys = 4,

    // When the target diastolic blood pressure is larger than the target systolic blood pressure
    TargetDiaLargerThenThresholdDia = 4,
}

/**
 * SetWeightThresholdExcerptNo
 */
export enum SetWeightThresholdExcerptNo {
    None = 0,

    // If Threshold not entered
    ThresholdIsNotInput = 1,

    // Not Threshold in object array format
    ThresholdIsNotObjectArray = 1,

    // When the number of elements in the array is not 2
    ThresholdExceedsTheRange = 1,

    // If SettingID not entered
    SettingIDIsnotInput = 2,

    // If SettingID the format is not an integer
    SettingIDIsNotInteger = 2,

    // When a number other than 1, 2 is specified
    SettingIDOther1Or2Specified = 2,

    // When the same threshold setting number is specified for two thresholds
    SettingIDSameForTowThreshold = 2,

    // If EnabledFlag not entered
    EnabledFlagIsNotInput = 3,

    // If EnabledFlag the format is not an integer
    EnabledFlagIsNotInteger = 3,

    // If  EnabledFlag a number other than 0.1 is specified
    EnabledFlagOther0Or1Specified = 3,

    // if Value not entered
    ValueIsNotInput = 4,

    // If Value the format is not numeric
    ValueIsNotInteger = 4,

    // When a number outside the range of [weight threshold setting lower limit] to
    // [weight threshold setting upper limit] is specified
    ValueOutSideTheRange = 4,

    // If Unit not entered
    UnitIsNotInput = 5,

    // If Unit the format is not an integer
    UnitIsNotInteger = 5,

    // When Unit a number other than 1, 2 is specified
    UnitOther1Or2Specified = 5,

    // If Period Unit not entered
    PeriodIsNotInput = 6,

    //  If Period the format is not an integer
    PeriodIsNotInteger = 6,

    // When a number outside the range of 1 to 30 is specified for the period
    PeriodOutSideTheRange = 6,
}

export enum UpdateHaidExcerptNo {
    None = 0,

    // If HaUserID not entered
    HaUserIDIsNotInput = 1,

    // If  HaUserID  not a string consisting of only alphanumeric characters
    HaUserIDisNotCharacterStringOfAlphanumericAlone = 1,

    // If HaUserID the number of characters is not 64
    HaUserIDIsNot64Characters = 1,
}

/**
 * Enum use for API setMedicalTime
 */
export enum SetMedicalTimeExcerptNo {
    // If start_timestamp is not entered
    StartTimeStampIsNotInput = 1,

    // If start_timestamp is not an integer
    StartTimeStampIsNotInteger = 1,

    // If timezone is not entered
    TimeZoneIsNotInput = 2,

    // If the format of timezone is not "±hh:mm"
    TimeZoneFormatInvalid = 2,

    // If medical_time is not entered
    MedicalTimeIsNotInput = 3,

    // If medical_time is not an integer
    MedicalTimeIsNotInteger = 3,

    // If medical_time is less than 0
    MedicalTimeIsLessThan0 = 3,
}

/**
 * Enum use for API getMedicalTime
 */
export enum GetMedicalTimeExcerptNo {
    // If monthly_start_date is not entered
    MonthlyStartDateIsNotInput = 1,

    // If monthly_start_date is not a date
    MonthlyStartDateIsNotADate = 1,

    // If a nonexistent date of monthly_start_date is specified
    MonthlyStartDateDoNotExistIsSpecified = 1,

    // If monthly_end_date is not entered
    MonthlyEndDateIsNotInput = 2,

    // If monthly_end_date is not a date
    MonthlyEndDateIsNotADate = 2,

    // If a nonexistent date of monthly_end_date is specified
    MonthlyEndDateDoNotExistIsSpecified = 2,

    // If monthly_end_date earlier than monthly_start_date
    MonthlyEndDateEarlierThanMonthlyStartDate = 2,
}
