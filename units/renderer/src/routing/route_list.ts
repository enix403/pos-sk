export type RouteConf = { name: string, path: string };


export const appRoutes = {
    home: { name: "Home", path: "/home" },
    stock: {
        tradeItems: { name: "Trade Items", path: "/stock/trade-items" },
        inventory: { name: "Inventory", path: "/stock/inventory" },
        storeItems: { name: "Store Items", path: "/store/store-items" }
    },
    customer: {
        cart: { name: "Customer Checkout", path: "/customer/checkout" },
    }
}

export const devAppRoutes = {
    scratch: { name: "Scratch Place", path: "/dev/scratch" }
};
