type PayloadInterface = {
  data: { [key: string]: any };
};

type FindInterface = {
  where: { [key: string]: any };
};

const dbClientMock: any = {
  shortUrl: {
    db: [] as any[],
    create: function (payload: PayloadInterface) {
      const data = {
        private: false,
        ...payload.data,
      };
      this.db.push(data);
      return data;
    },
    findFirst: function ({ where }: FindInterface) {
      let response = null;

      if (where.id) {
        const index: number = this.db.findIndex(({ id }) => id === where.id);
        response = index >= 0 ? this.db[index] : null;
      } else if (where.full) {
        const index: number = this.db.findIndex(
          ({ full }) => full === where.full
        );
        response = index >= 0 ? this.db[index] : null;
      }

      return response;
    },
  },
  usageStatistic: {
    db: [] as any[],
    create: function (payload: PayloadInterface) {
      const data = { id: Math.floor(Math.random() * 10000), ...payload.data };
      this.db.push(data);
      return data;
    },
    update: () => {},
    findFirst: function ({ where }: FindInterface) {
      let response = null;

      if (where.shortUrlId && where.period && where.value && where.year) {
        const index: number = this.db.findIndex(
          ({ shortUrlId, period, value, year }) =>
            shortUrlId === where.shortUrlId &&
            period === where.period &&
            value === where.value &&
            year === where.year
        );
        response = index >= 0 ? this.db[index] : null;
      }

      return response;
    },
    findMany: function ({ where }: FindInterface) {
      let response = null;

      if (where.shortUrlId && where.period) {
        const index: number = this.db.findIndex(
          ({ shortUrlId, period }) =>
            shortUrlId === where.shortUrlId && period === where.period
        );
        response = index >= 0 ? this.db[index] : null;
      }

      return [response];
    },
  },
};

export default dbClientMock;
