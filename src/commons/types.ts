export interface ShortUrlDto {
  id: string;
  full: string;
  shorten: string;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStatisticDto {
  id: number;
  shortUrlId: string;
  createdAt: Date;
}
