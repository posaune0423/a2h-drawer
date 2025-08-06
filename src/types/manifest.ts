export interface ManifestIcon {
  src: string;
  sizes: string;
  type?: string;
}

export interface WebAppManifest {
  name?: string;
  short_name?: string;
  icons?: ManifestIcon[];
  display?: string;
  theme_color?: string;
  background_color?: string;
  start_url?: string;
}
