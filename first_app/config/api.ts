// config/api.ts

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://cms.judiciary.go.tz/api/JotCMS/portal',
  
  // Case Fetch Endpoints
  PRIMARY_CASE_BY_REFERENCE: process.env.NEXT_PUBLIC_API_PRIMARY_CASE_BY_REFERENCE || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/fetch/primary/case/byreference',
  OTHER_LEVEL_CASE_BY_REFERENCE: process.env.NEXT_PUBLIC_API_OTHER_LEVEL_CASE_BY_REFERENCE || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/fetch/case/details/byreference',
  PRIMARY_CASE_DETAILS: process.env.NEXT_PUBLIC_API_PRIMARY_CASE_DETAILS || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/primary/case/get-primary-case-details',
  OTHER_LEVEL_CASE_DETAILS: process.env.NEXT_PUBLIC_API_OTHER_LEVEL_CASE_DETAILS || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/primary/case/details',
  
  // Courts and Case Types
  COURTS: process.env.NEXT_PUBLIC_API_COURTS || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/courts',
  PRIMARY_CASE_TYPES: process.env.NEXT_PUBLIC_API_PRIMARY_CASE_TYPES || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/primary_court_case_type',
  OTHER_CASE_TYPES: process.env.NEXT_PUBLIC_API_OTHER_CASE_TYPES || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/case-subtypes',
  CAUSE_LIST: process.env.NEXT_PUBLIC_API_CAUSE_LIST || 
    'https://cms.judiciary.go.tz/api/JotCMS/portal/causelist/bycourtname',


NEWS_BASE_URL: process.env.NEXT_PUBLIC_NEWS_API_URL || 'https://www.judiciary.go.tz/api/newsupdates',
  NEWS_GET_ALL: `${process.env.NEXT_PUBLIC_NEWS_API_URL || 'https://www.judiciary.go.tz/api/newsupdates'}/getAllNews`,
};