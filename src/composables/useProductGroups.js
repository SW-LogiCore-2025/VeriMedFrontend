import { computed } from 'vue'

export function useProductGroups() {
    const groupProductsByNameAndManufacturer = (products) => {
        if (!products || !products.length) return []

        const groups = {}

        products.forEach(product => {
            const name = product.serialNumber || 'Nombre no disponible'
            const manufacturer = product.manufacturer || 'Fabricante no disponible'
            const key = `${name}-${manufacturer}`

            if (!groups[key]) {
                groups[key] = { name, manufacturer, count: 0 }
            }
            groups[key].count++
        })

        return Object.values(groups)
    }

    return { groupProductsByNameAndManufacturer }
}