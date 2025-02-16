export interface pagerHeaderProps {
  title: string;
  description?: string;
}

export interface rowMusicCardProps {
  Title: string;
  url: string;
  url_path: string;
}

export interface rowMusicCardItem {
  name: string;
  image: string;
  link: string;
  duration: string;
  router?: any;
}

export interface playlistCardItem {
  title: string;
  counter: number;
  router?: any;
}
export interface genreTypes {
  name: string;
  link: string;
  db?: any;
  router?: any;
}

export interface genreItemTypes {
  name: string;
  image: string;
  link: string;
  router?: any;
}

export interface SearchCardProps {
  inType?: "songs" | "genres";
  shouldNavigate?: boolean;
  setter?: any;
  action?: any;
  word?: string | any;
}
