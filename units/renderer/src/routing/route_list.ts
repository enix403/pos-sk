export type RouteConf = { name: string, path: string };


export const appRoutes = {
    home: { name: "Home", path: "/home" },
    stock: {
        tradeItems: { name: "Trade Items", path: "/stock/trade-items" },
        inventory: { name: "Inventory", path: "/stock/inventory" },
    }
}

export const devAppRoutes = {
    scratch: { name: "Scratch Place", path: "/dev/scratch" }
};
