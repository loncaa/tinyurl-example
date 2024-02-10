export interface ShortUrlDto {
  id: string;
  full: string;
  private: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStatisticDto {
  id: number;
  shortUrlId: string;
  period: string;
  value: number;
  year: number;
  counter: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertStatisticPayload {
  shortUrlId: string;
  period: string;
  value: number;
  year: number;
  counter: number;
}
