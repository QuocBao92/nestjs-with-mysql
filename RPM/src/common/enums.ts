/**
 * Copyright (c) 2020 OMRON HEALTHCARE Co.,Ltd. All rights reserved.
 */

/**
 * Enum of Get Vital Data from OHI
 */
export enum VitalData {
    BloodPressureType = 1,
    WeightType = 2,
    AutomaticInputType = 1,
    ManualInputType = 2,
    AutomaticAndManualInputType = 3,
    OfficeInpuType = 4,
    AutomaticAndOfficeInputType = 5,
    ManualAndOfficeInputType = 6,
    AllInputType = 7,
    MeasurementDateType = 1,
    UpdateDateType = 2,
}

/**
 * Enum of Measurement State API Blood Pressure Detail
 */
export enum MeasurementState {
    Arrhythmia = 1,
    BodyMovement = 2,
    Cuff = 3,
}

/**
 * Enum of Measurement State Status API Blood Pressure Detail
 */
export enum MeasStateStatus {
    None = 0,
    IrregularPulseWave = 1,
    BodyMovement = 2,
    Cuff = 3,
}

/**
 * Input type of raw_data Blood pressure detail API
 */
export enum InputType {
    Automatic = 1,
    ManualInput = 2,
    OfficeInput = 3,
}
/**
 * Blood pressure alert notification flag in batch
 */
export enum AlertNoticeFlag {
    NotRequired,
    NotNotified,
    Notified,
}

/**
 * CodeType
 */
export enum CodeType {
    Normally = 1,
    AtTheError,
}

/**
 * ProcessingType
 */
export enum ProcessingType {
    // API implemented in OHI system
    APIForOHI,

    // API to call RPM system from doctor dashboard
    APIforDoctorDashboard,

    // Batch processing in RPM
    BatchProcessing,
}

/**
 * MessageType
 */
export enum MessageType {
    None = '',
    IsRequired = 'IsRequired',
    AuthFailed = 'AuthFailed',
    AuthHasExpired = 'AuthHasExpired',
    NotValid = 'NotValid',
    InternalServerError = 'InternalServerError',
    InvalidFormat = 'InvalidFormat',
    Invalid = 'Invalid',
    MustBeNewerThan = 'MustBeNewerThan',
    MustBeANumber = 'MustBeANumber',
    MustBeLowerThan = 'MustBeLowerThan',
    MustBeObjectArray = 'MustBeObjectArray',
    MustBeUnique = 'MustBeUnique',
    CasesExceedsTheRange = 'CasesExceedsTheRange',
    Conflict = 'Conflict',
    IsDeleted = 'IsDeleted',
    IsNotFound = 'IsNotFound',
    UnAuthorized = 'UnAuthorized',
    SessionExpired = 'SessionExpired',
    SessionIDCertificationFailed = 'SessionIDCertificationFailed',
    JSONMessageIsNotParseable = 'JSONMessageIsNotParseable',
    Mustbe64Characters = 'Mustbe64Characters',
    MustbeAlphanumeric = 'MustbeAlphanumeric',
}

/**
 * ApiList
 */
export enum ApiList {
    login = 1,
    registerUser = 1,
    unregisterUser,
    getMedicalTimeOHI,
    patientList = 2,
    commonDetail,
    bloodPressureDetail,
    weightDetail,
    getPersonalBloodPressure,
    setPersonalBloodPressure,
    getWeightThreshold,
    setWeightThreshold,
    confirmSession,
    updateHaid,
    getMedicalTime,
    setMedicalTime,
}

/**
 * * A.Server internal error
 * * B.Input value error.
 */
export enum ErrorType {
    /**
     * Server internal error
     */
    A = 'A',

    /**
     * Input value error
     */
    B = 'B',
}

/**
 * ClassificationCode
 */
export enum ClassificationCode {
    // When a null value is set for an item that cannot be omitted.
    ValueUnsetting = 1,

    // When a value that does not exist is specified.
    UnknownValue = 2,

    // The date format is incorrect.
    FormIllegal = 3,

    // When a non-numeric value is set where a numeric value should be specified.
    RangeIsIllegal = 4,

    // If you specify a number or date that is out of the acceptable range
    CharacterNumberIllegal = 5,

    // When the number of characters that can be registered is exceeded.
    CharacterCannotUsed = 6,

    // When an invalid character is included.
    ValueIsIllegal = 7,

    // Conflit Value
    ValueConflit = 7,

    // When the number of data exceeds the number that can be processed.
    NumberOfExcess = 8,

    // When the JSON format is invalid.
    JSONFormIsIllegal = 901,

    // When the method specification is invalid.
    MethodIsIllegal = 902,

    // When the specification of the content type is invalid.
    ContentsIsIllegal = 903,

    // The data size of the request has been exceeded.
    DataSizeExcess = 904,

    // When an API authentication error occurs between VPCs.
    AttestationError = 905,

    // When there is no access right to the requesting IP address.
    AccessRightError = 906,

    // When an API authentication expired occurs between VPCs.
    AttestationExpired = 907,

    // When there is not found data.
    IsNotFound = 908,

    // When an error occurs during processing inside the RPM server, such as a failure in DB connection.
    InternalError = 999,

    // When the error occurs by the response of OHI-API and the batch terminates abnormally
    OhiError = 911,

    // When the error occurs by the response of ALGO-API and the batch terminates abnormally
    AlgoError = 911,

    // When batch is abnormally terminated due to inconsistency of registered patient information
    DbPatientError = 913,

    // When the expected parameter does not exist in the setting information master
    DbMasterError = 914,
}

/**
 * Message field
 */
export enum MessageField {
    // Target systolic blood pressure
    TargetSys = 'target_sys',

    // Target diastolic blood pressure
    TargetDia = 'target_dia',

    // Threshold systolic blood pressure
    ThresholdSys = 'threshold_sys',

    // Threshold diastolic blood pressure
    ThresholdDia = 'threshold_dia',

    // Date From
    DateFrom = 'date_from',

    // Date From
    DateTo = 'date_to',

    // Ha_user_id
    HAID = 'ha_user_id',

    // Screen Type
    ScreenType = 'screen_type',

    // Contract Weigt Scale
    ContractWeigtScale = 'contract_weight_scale',

    // Smart phone use existence
    UseSmartPhone = 'smartphone_use',

    // HAID regist date
    HAIDRegistDate = 'ha_regist_date',

    // Patient Contract
    PatientContract = 'Patient contract',

    // Type of API patientList
    Type = 'type',

    // Start of counting date
    StartTimestamp = 'start_timestamp',

    // Timezone
    Timezone = 'timezone',

    // The Consultation time
    MedicalTime = 'medical_time',

    // Monthly consultation time starting date
    MonthlyStartDate = 'monthly_start_date',

    // Monthly consultation time closing date
    MonthlyEndDate = 'monthly_end_date',

    // Acquisition start date
    StartDate = 'start_date',

    // Acquisition end date
    EndDate = 'end_date',

    // Threshold object
    Threshold = 'threshold',

    // Threshold setting id
    SettingId = 'id',

    // Threshold valid flag
    EnabledFlag = 'enabled_flag',

    // Threshold value
    Value = 'value',

    // Threshold unit
    Unit = 'unit',

    // Threshold period
    Period = 'period',
}

/**
 * Type of Page
 */
export enum PageType {
    BloodPressure = 1,
    Weight = 2,
}

/**
 * Type of Screen
 */
export enum ScreenType {
    ListPatient = 'list-patient',
    PatientDetail = 'patient-detail',
}

/**
 * Type of Weight Scale
 */
export enum WeightScale {
    Yes = 1,
    None = 0,
}
/**
 * Type of contract application
 */
export enum ContractApplication {
    Yes = 1,
    No = 0,
}
/**
 * Type of Irregular Heartbeat
 */
export enum IrregularHeartbeat {
    Yes = 1,
    No = 0,
}
/**
 * Type of cuff winding state
 */
export enum Cuff {
    Normal = 1,
    Abnormal = 0,
}
/**
 * Type of Irregular Heartbeat
 */
export enum DeleteFlag {
    Yes = 1,
    No = 0,
}
/**
 * Type of Body Movement
 */
export enum BodyMovement {
    Yes = 1,
    No = 0,
}
/**
 * Type of Contract Weight
 */
export enum ContractWeight {
    Yes = 1,
    No = 0,
}
/**
 * Value of Threshold setting id
 */
export enum ThresholdSettingId {
    SettingOne = 1,
    SettingTwo = 2,
}
/**
 * Value of Threshold enabled flag
 */
export enum ThresholdEnabledFlag {
    OFF = 0,
    ON = 1,
}
/**
 * Unit of Threshold
 */
export enum ThresholdUnit {
    Kg = 1,
    Lbs = 2,
}
/**
 * Keys for get setting values in setting table
 */
export enum Keys {
    sys_max = 'sys_max',
    dia_max = 'dia_max',
    sys_min = 'sys_min',
    dia_min = 'dia_min',
    rank_l_lower = 'rank_l_lower',
    rank_m_lower = 'rank_m_lower',
    rank_h_lower = 'rank_h_lower',
    ohi_retry_times = 'ohi_retry_times',
    ohi_retry_interval = 'ohi_retry_interval',
    base_date_month = 'base_date_month',
    medical_time_polling_interval = 'medical_time_polling_interval',
    weight_threshold_max = 'weight_threshold_max',
    weight_threshold_min = 'weight_threshold_min',
    weight_period_max = 'weight_period_max',
    weight_period_min = 'weight_period_min',
}

// Log entry name
export enum RpmEntryName {
    ApiLogin = 'api-login',
    ApiUpdateHaid = 'api-updateHaid',
    ApiConfirmSession = 'api-confirmSession',
    ApiPatientList = 'api-patientList',
    ApiCommonDetail = 'api-commonDetail',
    ApiBloodPressureDetail = 'api-bloodPressureDetail',
    ApiWeightDetail = 'api-weightDetail',
    ApiGetPersonalBloodPressure = 'api-getPersonalBloodPressure',
    ApiSetPersonalBloodPressure = 'api-setPersonalBloodPressure',
    ApiGetWeightThreshold = 'api-getWeightThreshold',
    ApiSetWeightThreshold = 'api-setWeightThreshold',
    ApiRegisterUser = 'api-registerUser',
    ApiUnregisterUser = 'api-unregisterUser',
    ApiGetMedicalTime = 'api-getMedicalTime',
    ApiSetMedicalTime = 'api-setMedicalTime',
}
/**
 * Log entry name of OHI
 */
export enum OHIEntryName {
    ApiGetHAID = 'api-getHAID',
    ApiGetPersonalInfo = 'api-getPersonalInfo',
    ApiGetWeightInfo = 'api-getWeightInfo',
    ApiGetWeightThreshold = 'api-getWeightThreshold',
    ApiGetVitalData = 'api-getVitalData',
    ApiGetVitalAverageData = 'api-getVitalAverageData',
    ApiGetPrescriptionInfo = 'api-getPrescriptionInfo',
    ApiGetSideEffectInfo = 'api-getSideEffectInfo',
    ApiGetPersonalBPInfo = 'api-getPersonalBPInfo',
    ApiSetPersonalBPInfo = 'api-setPersonalBPInfo',
    ApiSendBPAlert = 'api-sendBPAlert',
    ApiGetTakingMedicineInfo = 'api-getTakingMedicineInfo',
    ApiSetWeightThreshold = 'api-setWeightThreshold',
}
/**
 * Log entry name of Algo
 */
export enum AlgoEntryName {
    ApiDetectUpTrendBP = 'api-detectUpTrendBP',
    ApiDetectDownTrendBP = 'api-detectDownTrendBP',
    ApiDetectContraryTrendsBPandPulse = 'api-detectContraryTrendsBPandPulse',
    ApiDetectBradycardia = 'api-detectBradycardia',
    ApiDetectLowBP = 'api-detectLowBP',
}
/**
 * Log entry name of Batch
 */
export enum BatchEntryName {
    BatchVital = 'batch-vital',
    BatchDeleteSession = 'batch-delete-session',
    BatchWeightAlert = 'batch-weight-alert',
    BatchAlert = 'batch-alert',
}

/**
 * Rule numbers
 */
export enum RuleNumbers {
    BatchVital = 1,
    BatchAlert = 3,
    BatchDeleteSession = 4,
}

// Log level
export enum LogLevel {
    FATAL = 'FATAL',
    ERROR = 'ERROR',
    WARN = 'WARN',
    INFO = 'INFO',
    DEBUG = 'DEBUG',
}

/**
 * Is Batch Running Status
 */
export enum IsBatchRunningStatus {
    ON = 'ON',
    OFF = 'OFF',
}

/**
 * Is Manual running batch
 */
export enum CallBatchFrom {
    Manual = 'true',
    Schedule = 'false',
}

/**
 * Weight Alert
 */
export enum WeightAlert {
    None = 0,
    Low = 1,
    High = 2,
}
