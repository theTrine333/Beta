export interface pagerHeaderProps {
  title?: any;
  description?: string;
}

export interface rowMusicCardProps {
  Title: string;
  url: string;
  url_path: string;
  router?: any;
}

export interface rowMusicCardItem {
  list?: [];
  index?: any;
  setList?: any;
  connector?: any;
  isDeletable?: boolean;
  isOnline?: boolean;
  name: string;
  image: string;
  link: string;
  duration?: string;
  router?: any;
  isDownload?: boolean;
}

export interface playlistCardItem {
  loaderFunc?: any;
  connector?: any;
  setVisible?: any;
  childName?: string;
  childImage?: string;
  childLink?: string;
  setFav?: boolean;
  title: string;
  counter: number;
  router?: any;
}

export interface NoResultCardProp {
  noDesc?: boolean;
}
export interface genreTypes {
  name?: any;
  link?: any;
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
  isSearch?: boolean;
  name: string;
  image: string;
  link: string;
  router?: any;
}

export interface SearchCardProps {
  inType?: "songs" | "genres";
  Parent: "songs" | "genres" | "downloads" | "favourites";
  shouldNavigate?: boolean;
  setter?: any;
  action?: any;
  word?: string | any;
}

export interface downloadsModalProps {
  quiter?: any;
  isQueue?: boolean;
  setVisible?: any;
  loaderFunc?: any;
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
