import { useState, useEffect } from 'react'
import type { Product, ProductsResponse, ProductStats, CategoryData, StockData } from '@/types/products'

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([])
    const [stats, setStats] = useState<ProductStats | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true)
                const response = await fetch('https://dummyjson.com/products?limit=0')

                if (!response.ok) {
                    throw new Error('Failed to fetch products')
                }

                const data: ProductsResponse = await response.json()
                setProducts(data.products)

                // Process statistics
                const processedStats = processProductStats(data.products)
                setStats(processedStats)

                setError(null)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred')
                console.error('Error fetching products:', err)
            } finally {
                setLoading(false)
            }
        }

        fetchProducts()
    }, [])

    return { products, stats, loading, error }
}

function processProductStats(products: Product[]): ProductStats {
    // Get unique categories
    const categoryMap = new Map<string, CategoryData>()

    products.forEach(product => {
        if (!categoryMap.has(product.category)) {
            categoryMap.set(product.category, {
                name: product.category,
                count: 0,
                totalStock: 0,
                avgPrice: 0
            })
        }

        const category = categoryMap.get(product.category)!
        category.count++
        category.totalStock += product.stock
    })

    // Calculate average price for each category
    const categoryData: CategoryData[] = Array.from(categoryMap.values()).map(cat => {
        const categoryProducts = products.filter(p => p.category === cat.name)
        const avgPrice = categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length
        return { ...cat, avgPrice: Math.round(avgPrice * 100) / 100 }
    })

    // Stock analysis
    const lowStockCount = products.filter(p => p.stock > 0 && p.stock < 50).length
    const outOfStockCount = products.filter(p => p.stock === 0).length
    const inStockCount = products.filter(p => p.stock >= 50).length

    const stockData: StockData[] = [
        { name: 'In Stock', value: inStockCount },
        { name: 'Low Stock', value: lowStockCount },
        { name: 'Out of Stock', value: outOfStockCount }
    ]

    // Calculate overall stats
    const totalStock = products.reduce((sum, p) => sum + p.stock, 0)
    const averagePrice = products.reduce((sum, p) => sum + p.price, 0) / products.length

    return {
        totalProducts: products.length,
        totalCategories: categoryMap.size,
        averagePrice: Math.round(averagePrice * 100) / 100,
        totalStock,
        lowStockCount,
        outOfStockCount,
        categoryData: categoryData.sort((a, b) => b.count - a.count),
        stockData
    }
}
