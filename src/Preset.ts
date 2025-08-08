import Metadata from './Metadata'
import UMFError from './Error'

// Interface for field validation
export interface FieldValidator {
  required: boolean
  acceptedValues?: string[]
  format?: RegExp
  description?: string
}

// Interface for preset configuration
export interface PresetConfig {
  requiredFields: Map<string, FieldValidator>
  allowExtraFields?: boolean
}

// Type for initial field data
export interface InitialFieldData {
  header?: string
  value: string
}

// The preset class for creating, modifying, and validating metadata
export default class Preset<T extends Record<PropertyKey, any> = Record<string, string | undefined>> {
  private config: PresetConfig

  constructor(config: PresetConfig) {
    this.config = config
  }

  // Create a new metadata with the preset's required fields
  public create(mediaName: string, initialFields?: Partial<Record<keyof T, InitialFieldData>>): Metadata<T> {
    if (!mediaName.trim()) {
      throw new UMFError('Empty Media Name')
    }

    const metadata = new Metadata<T>(mediaName)

    // Add initial fields if provided
    if (initialFields) {
      for (const [fieldName, fieldData] of Object.entries(initialFields)) {
        if (fieldData) {
          metadata.set(fieldData.header || null, fieldName, fieldData.value)
        }
      }
    }

    return metadata
  }

  // Validate a metadata against the preset
  public validate(metadata: Metadata<T>): void {
    const errors: string[] = []

    // Check if all required fields are present
    for (const [fieldName, validator] of this.config.requiredFields) {
      if (validator.required) {
        let found = false

        // Check global fields
        if (metadata.has(null, fieldName)) {
          found = true
          this.validateFieldValue(fieldName, metadata.get(null, fieldName)!, validator, errors)
        }

        // Check in all headers/groups
        for (const [header] of metadata.groups) {
          if (metadata.has(header, fieldName)) {
            found = true
            this.validateFieldValue(fieldName, metadata.get(header, fieldName)!, validator, errors)
          }
        }

        if (!found) {
          errors.push(`Required field '${fieldName}' is missing`)
        }
      }
    }

    // Validate existing fields
    this.validateExistingFields(metadata, errors)

    if (errors.length > 0) {
      throw new UMFError(`Validation failed: ${errors.join(', ')}`)
    }
  }

  // Modify an existing metadata by setting a field
  public setField(metadata: Metadata<T>, header: string | null, name: keyof T, value: string): void {
    if (!String(name).trim()) {
      throw new UMFError('Empty Field Name')
    }
    if (!value.trim()) {
      throw new UMFError('Empty Field Value')
    }

    // Validate the field if it's defined in the preset
    const validator = this.config.requiredFields.get(name as string)
    if (validator) {
      const errors: string[] = []
      this.validateFieldValue(name as string, value, validator, errors)
      if (errors.length > 0) {
        throw new UMFError(`Field validation failed: ${errors.join(', ')}`)
      }
    } else if (!this.config.allowExtraFields) {
      throw new UMFError(`Field '${String(name)}' is not allowed by this preset`)
    }

    metadata.set(header, name, value)
  }

  // Get the preset configuration
  public getConfig(): PresetConfig {
    return { ...this.config }
  }

  // Private method to validate field value
  private validateFieldValue(fieldName: string, value: string, validator: FieldValidator, errors: string[]): void {
    if (validator.acceptedValues && !validator.acceptedValues.includes(value)) {
      errors.push(`Field '${fieldName}' has invalid value '${value}'. Accepted values: ${validator.acceptedValues.join(', ')}`)
    }

    if (validator.format && !validator.format.test(value)) {
      errors.push(`Field '${fieldName}' has invalid format: '${value}'`)
    }
  }

  // Private method to validate all existing fields
  private validateExistingFields(metadata: Metadata<T>, errors: string[]): void {
    // Validate global fields
    for (const [fieldName] of metadata.global) {
      const validator = this.config.requiredFields.get(fieldName)
      if (validator) {
        this.validateFieldValue(fieldName, metadata.get(null, fieldName)!, validator, errors)
      } else if (!this.config.allowExtraFields) {
        errors.push(`Field '${fieldName}' is not allowed by this preset`)
      }
    }

    // Validate fields in groups/headers
    for (const [header, group] of metadata.groups) {
      for (const [fieldName] of group) {
        const validator = this.config.requiredFields.get(fieldName)
        if (validator) {
          this.validateFieldValue(fieldName, metadata.get(header, fieldName)!, validator, errors)
        } else if (!this.config.allowExtraFields) {
          errors.push(`Field '${fieldName}' is not allowed by this preset`)
        }
      }
    }
  }
}
