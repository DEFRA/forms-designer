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
}

export type FormByIdInput = Pick<FormMetadata, 'id'>
export type FormBySlugInput = Pick<FormMetadata, 'slug'>
export type FormMetadataDocument = Omit<FormMetadata, 'id'>
export type FormMetadataInput = Omit<
  FormMetadata,
  | 'id'
  | 'slug'
  | 'draft'
  | 'live'
  | 'createdBy'
  | 'createdAt'
  | 'updatedBy'
  | 'updatedAt'
>
