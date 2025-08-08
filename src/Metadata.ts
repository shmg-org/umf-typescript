// The metadata.
export default class Metadata {
  public media_name: string
  public global: Map<string, string>
  public groups: Map<string, Map<string, string>>

  constructor(media_name: string) {
    this.media_name = media_name
    this.global = new Map()
    this.groups = new Map()
  }

  // Check if a field exists.
  has(header: string | null, name: string): boolean {
    return this.get(header, name) !== undefined
  }

  // Get a field.
  get(header: string | null, name: string): string | undefined {
    if (header) {
      const group = this.groups.get(header)

      if (group) {
        const value = group.get(name)

        if (value !== undefined) {
          return value
        }
      }

      return this.global.get(name)
    }
    return this.global.get(name)
  }

  // Set a field.
  set(header: string | null, name: string, value: string): void {
    if (header === null) {
      this.global.set(name, value)
    } else {
      let group = this.groups.get(header)

      if (!group) {
        group = new Map()
        this.groups.set(header, new Map())
      }

      group.set(name, value)
    }
  }

  // Get string representation.
  toString(): string {
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
