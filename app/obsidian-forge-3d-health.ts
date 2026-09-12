export const OBSIDIAN_FORGE_MODEL_URL = '/models/Photorealistic_Obsidian_Forge_Monolith_V7.glb'

/**
 * Runtime contract for the Forge hero. Keep this file dependency-free so it
 * can also be imported by lightweight diagnostics without instantiating WebGL.
 */
export const OBSIDIAN_FORGE_RENDERER_CONFIG = {
  outputColorSpace: 'SRGBColorSpace',
  toneMapping: 'ACESFilmicToneMapping',
  toneMappingExposure: 0.8,
} as const
