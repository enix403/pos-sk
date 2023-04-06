export type RouteConf = { name: string, path: string };


export const appRoutes = {
    home: { name: "Home", path: "/home" },
    stock: {
        // tradeItems: { name: "Trade Items", path: "/stock/trade-items" },
        updateStock: { name: "Update Stock", path: "/stock/update-stock" },
        storeItems: { name: "Store Items", path: "/store/store-items" }
    },
}

export const devAppRoutes = {
    scratch: { name: "Scratch Place", path: "/dev/scratch" }
};
