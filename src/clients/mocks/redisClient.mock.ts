const redisClientMock: any = {
  db: {} as { [key: string]: any },
  set: function (key: string, value: unknown) {
    this.db[key] = value;
    return value;
  },
  get: function (key: string) {
    return this.db[key];
  },
  incr: function (key: string) {
    if (!this.db[key]) {
      this.db[key] = 0;
    }

    this.db[key] = this.db[key] + 1;
    return this.db[key];
  },
  connect: () => {},
  sendCommand: () => {},
  subscribe: () => {},
  duplicate: () => ({ ...redisClientMock }),
  scan: function () {
    return {
      keys: Object.keys(this.db),
    };
  },
  isOpen: true,
};

export default redisClientMock;
