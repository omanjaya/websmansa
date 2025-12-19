/**
 * Export utility functions for data export
 */

export function exportToCSV<T extends Record<string, unknown>>(
    data: T[],
    filename: string,
    columns: { key: keyof T; label: string }[]
) {
    if (data.length === 0) {
        alert('Tidak ada data untuk di-export')
        return
    }

    // Create CSV header
    const header = columns.map((col) => col.label).join(',')

    // Create CSV rows
    const rows = data.map((row) => {
        return columns
            .map((col) => {
                let value: unknown = row[col.key]

                // Handle nested object values (e.g., attributes.title)
                if (col.key.toString().includes('.')) {
                    const keys = col.key.toString().split('.')
                    value = keys.reduce((obj: Record<string, unknown>, key) => (obj as Record<string, unknown>)?.[key] as Record<string, unknown>, row as Record<string, unknown>)
                }

                // Handle different data types
                if (value === null || value === undefined) {
                    return ''
                }

                // Handle arrays
                if (Array.isArray(value)) {
                    value = value.length
                }

                // Handle objects
                if (typeof value === 'object') {
                    value = JSON.stringify(value)
                }

                // Escape commas and quotes
                const stringValue = String(value)
                if (stringValue.includes(',') || stringValue.includes('"')) {
                    return `"${stringValue.replace(/"/g, '""')}"`
                }

                return stringValue
            })
            .join(',')
    })

    // Combine header and rows
    const csv = [header, ...rows].join('\n')

    // Create blob and download
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}

export function exportToJSON<T>(data: T[], filename: string) {
    if (data.length === 0) {
        alert('Tidak ada data untuk di-export')
        return
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.json`)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
}
