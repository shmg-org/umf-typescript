// The metadata.
export default class Metadata<T extends Record<PropertyKey, any> = Record<string, string | undefined>> {
  public media_name: string
  public global: Map<string, string>
  public groups: Map<string, Map<string, string>>

  constructor(media_name: string) {
    this.media_name = media_name
    this.global = new Map()
    this.groups = new Map()
  }

  // Check if a field exists.
  public has(header: string | null, name: keyof T): boolean {
    return this.get(header, name) !== undefined
  }

  // Get a field.
  public get(header: string | null, name: keyof T): string | undefined {
    if (header) {
      const group = this.groups.get(header)

      if (group) {
        const value = group.get(name as string)

        if (value !== undefined) {
          return value
        }
      }

      return this.global.get(name as string)
    }

    return this.global.get(name as string)
  }

  // Set a field.
  public set(header: string | null, name: keyof T, value: string): void {
    if (header === null) {
      this.global.set(name as string, value)
    } else {
      let group = this.groups.get(header)

      if (!group) {
        group = new Map()
        this.groups.set(header, group)
      }

      group.set(name as string, value)
    }
  }

  // Get string representation.
  public toString(): string {
    const lines: string[] = [this.media_name]

    if (this.global.size > 0) {
      lines.push('')

      for (const [name, value] of this.global) {
        lines.push(`${name}: ${value}`)
      }
    }

    if (this.groups.size === 0) {
      return lines.join('\n')
    }

    for (const [header, group] of this.groups) {
      lines.push(`\n[ ${header} ]\n`)

      for (const [name, value] of group) {
        lines.push(`${name}: ${value}`)
      }
    }

    return lines.join('\n')
  }
}
