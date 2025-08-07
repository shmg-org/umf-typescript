import Metadata from './Metadata'
import UMFError from './Error'

// Parse a metadata.
export default function parse(input: string): Metadata {
  const lines = input.split('\n')

  const media_name = lines[0]?.trim()
  if (!media_name) {
    throw new UMFError('Empty Media Name', 1, lines[0])
  }

  const metadata = new Metadata(media_name)
  let header: string | null = null

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]?.trim()

    if (!line || line.startsWith('#')) {
      continue
    } else if (line.startsWith('[') && line.endsWith(']')) {
      header = line.slice(1, -1).trim()
      if (!header) {
        throw new UMFError('Empty Header Name', i + 1, line)
      }
    } else if (line.includes(':')) {
      const separatorIndex = line.indexOf(':')
      const name = line.substring(0, separatorIndex).trim()
      const value = line.substring(separatorIndex + 1).trim()

      if (!name) {
        throw new UMFError('Empty Field Name', i + 1, line)
      }
      if (!value) {
        throw new UMFError('Empty Field Value', i + 1, line)
      }

      metadata.set(header, name, value)
    } else {
      throw new UMFError('Invalid Line', i + 1, line)
    }
  }

  return metadata
}
