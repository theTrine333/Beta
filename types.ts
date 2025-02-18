export interface pagerHeaderProps {
  title: string;
  description?: string;
}

export interface rowMusicCardProps {
  Title: string;
  url: string;
  url_path: string;
  router?: any;
}

export interface rowMusicCardItem {
  name: string;
  image: string;
  link: string;
  duration: string;
  router?: any;
  isDownload?: boolean;
}

export interface playlistCardItem {
  title: string;
  counter: number;
  router?: any;
}

export interface NoResultCardProp {
  noDesc?: boolean;
}
export interface genreTypes {
  name: string;
  link: string;
  db?: any;
  router?: any;
}

export interface toggleButtonProp {
  Text: string;
  Parent: string;
  setParent: any;
  isSelectable: boolean;
}
export interface genreItemTypes {
  name: string;
  image: string;
  link: string;
  router?: any;
}

export interface SearchCardProps {
  inType?: "songs" | "genres" | "downloads" | "favourites";
  shouldNavigate?: boolean;
  setter?: any;
  action?: any;
  word?: string | any;
}

export interface downloadsModalProps {
  setVisible?: any;
  router?: any;
  reloader?: any;
  connector?: any;
  image?: any;
  title?: any;
  duration?: any;
  position?: number;
  onClose?: any;
  onSave?: any;
}
export interface SegmentedControlProps {
  options: string[];
  onChange?: (selectedOption: any) => void;
}

export interface SegmentedControlState {
  selectedIndex: number;
}
