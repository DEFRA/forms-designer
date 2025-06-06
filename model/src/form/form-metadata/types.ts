import { formMetadataSchema } from '~/src/form/form-metadata/index.js'

/**
 * Interface for author (createdBy and updatedBy)
 */
export interface FormMetadataAuthor {
  /**
   * The ID of the user
   */
  id: string

  /**
   * The display name of the user
   */
  displayName: string
}

/**
 * Interface for metadata state (draft & live)
 */
export interface FormMetadataState {
  /**
   * The date the form state was created
   */
  createdAt: Date

  /**
   * The author who created the state
   */
  createdBy: FormMetadataAuthor

  /**
   * The date the form state was last updated
   */
  updatedAt: Date

  /**
   * The author who last updated the state
   */
  updatedBy: FormMetadataAuthor
}

/**
 * Interface for email contact details
 */
export interface FormMetadataContactEmail {
  /**
   * The email address details for support
   */
  address: string

  /**
   * How long it takes to receive a support response
   */
  responseTime: string
}

/**
 * Interface for online contact details
 */
export interface FormMetadataContactOnline {
  /**
   * The url of the online contact link
   */
  url: string

  /**
   * The text of the online contact link
   */
  text: string
}

/**
 * Interface for contact details (phone, email and online)
 */
export interface FormMetadataContact {
  /**
   * The phone details for support
   */
  phone?: string

  /**
   * The email details for support
   */
  email?: FormMetadataContactEmail

  /**
   * The online details for support
   */
  online?: FormMetadataContactOnline
}

/**
 * Interface for `formMetadataSchema` Joi schema
 * @see {@link formMetadataSchema}
 */
export interface FormMetadata {
  /**
   * The id of the form
   */
  id: string

  /**
   * The human-readable slug id of the form
   */
  slug: string

  /**
   * The human-readable title of the form
   */
  title: string

  /**
   * The organisation this form belongs to
   */
  organisation: string

  /**
   * The name of the team who own this form
   */
  teamName: string

  /**
   * The email of the team who own this form
   */
  teamEmail: string
  /**
   * The contact details of the form
   */
  contact?: FormMetadataContact

  /**
   * The guidance text displayed on the form submitted page
   */
  submissionGuidance?: string

  /**
   * The url of the privacy notice
   */
  privacyNoticeUrl?: string

  /**
   * Email address where form responses are sent
   */
  notificationEmail?: string

  /**
   * The draft state of the form
   */
  draft?: FormMetadataState

  /**
   * The live state of the form
   */
  live?: FormMetadataState

  /**
   * The author who created the form
   */
  createdBy: FormMetadataState['createdBy']

  /**
   * The date the form was created
   */
  createdAt: FormMetadataState['createdAt']

  /**
   * The author who last updated the form
   */
  updatedBy: FormMetadataState['updatedBy']

  /**
   * The date the form was last updated
   */
  updatedAt: FormMetadataState['updatedAt']

  /**
   * Is Authentication required to access the form
   */
  authRequired?: boolean
}

export type FormByIdInput = Pick<FormMetadata, 'id'>
export type FormByIDAndPageByIdInput = Pick<FormMetadata, 'id'> & {
  pageId: string
}
export type FormByIDAndPageByIdAndComponentByIdInput = Pick<
  FormMetadata,
  'id'
> & {
  pageId: string
  componentId: string
}
export type FormBySlugInput = Pick<FormMetadata, 'slug'>
export type FormMetadataDocument = Omit<FormMetadata, 'id'>
export type FormMetadataInput = Pick<
  FormMetadata,
  | 'title'
  | 'organisation'
  | 'teamName'
  | 'teamEmail'
  | 'contact'
  | 'submissionGuidance'
  | 'privacyNoticeUrl'
  | 'notificationEmail'
>

export interface FormResponse {
  id: FormMetadata['id']
  slug: FormMetadata['slug']
  status: string
}
