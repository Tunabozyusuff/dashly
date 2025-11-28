// Types for DummyJSON Products API
export interface Product {
    id: number
    title: string
    description: string
    price: number
    discountPercentage: number
    rating: number
    stock: number
    brand: string
    category: string
    thumbnail: string
    images: string[]
}

export interface ProductsResponse {
    products: Product[]
    total: number
    skip: number
    limit: number
}

export interface ProductStats {
    totalProducts: number
    totalCategories: number
    averagePrice: number
    totalStock: number
    lowStockCount: number
    outOfStockCount: number
    categoryData: CategoryData[]
    stockData: StockData[]
}

export interface CategoryData {
    name: string
    count: number
    totalStock: number
    avgPrice: number
}

export interface StockData {
    name: string
    value: number
}
