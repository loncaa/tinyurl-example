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
    deleteMany: function () {
      this.db = [];
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
    db: {} as { [key: string]: any },
    create: () => {},
    update: () => {},
    deleteMany: () => {},
    createMany: () => {},
    findFirst: () => {},
  },
};

export default dbClientMock;
