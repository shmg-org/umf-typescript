import Preset, { type FieldValidator, type PresetConfig } from './Preset'

// Anime preset specific types
export interface AnimeFields {
  Type: 'BDRip' | 'WebRip'
  Source: string  // Format: <Source Name> (<Source URL?>)
  Subtitle: string  // Format: <Source Name> (<Source URL?>)
  Resolution: '720p' | '1080p' | '1440p' | '4K'
  Encoding: string  // Format: <Video Codec> (<Audio Codec>)
  [key: string]: string | undefined  // Allow extra fields
}

// Music preset specific types
export interface MusicFields {
  Type: 'CDRip' | 'GameRip' | 'WebRip'
  'Track Number': string  // Must be numeric string
  Performer?: string
  Composer?: string
  Arranger?: string
  Lyricist?: string
  [key: string]: string | undefined  // Allow extra fields
}

// Anime preset configuration
const animeConfig: PresetConfig = {
  requiredFields: new Map<string, FieldValidator>([
    ['Type', {
      required: true,
      acceptedValues: ['BDRip', 'WebRip'],
      description: 'The type of the source video'
    }],
    ['Source', {
      required: true,
      format: /^.+\s*\([^)]*\)$/,
      description: 'The source of the video (encoder, platform, etc.). Format: <Source Name> (<Source URL?>)'
    }],
    ['Subtitle', {
      required: true,
      format: /^.+\s*\([^)]*\)$/,
      description: 'The source of the subtitle (subtitle team, platform, etc.). Format: <Source Name> (<Source URL?>)'
    }],
    ['Resolution', {
      required: true,
      acceptedValues: ['720p', '1080p', '1440p', '4K'],
      description: 'The resolution of the video'
    }],
    ['Encoding', {
      required: true,
      format: /^(H\.264|H\.265|VP9)\s*\((AAC|FLAC)\)$/,
      description: 'The video and audio codec for the anime. Format: <Video Codec> (<Audio Codec>)'
    }]
  ]),
  allowExtraFields: true
}

// Music preset configuration
const musicConfig: PresetConfig = {
  requiredFields: new Map<string, FieldValidator>([
    ['Type', {
      required: true,
      acceptedValues: ['CDRip', 'GameRip', 'WebRip'],
      description: 'The type of the source audio'
    }],
    ['Performer', {
      required: false,
      description: 'The performer of the track (optional)'
    }],
    ['Composer', {
      required: false,
      description: 'The composer of the track (optional)'
    }],
    ['Arranger', {
      required: false,
      description: 'The arranger of the track (optional)'
    }],
    ['Lyricist', {
      required: false,
      description: 'The lyricist of the track (optional)'
    }],
    ['Track Number', {
      required: true,
      format: /^\d+$/,
      description: 'The index of the track in the album'
    }]
  ]),
  allowExtraFields: true
}

// Export the preset config and typed preset instances
export const Anime = new Preset<AnimeFields>(animeConfig)
export const Music = new Preset<MusicFields>(musicConfig)

// Export configurations for advanced users
export const AnimeConfig = animeConfig
export const MusicConfig = musicConfig
