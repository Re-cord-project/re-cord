import React from 'react'
import { Controller, useFormContext } from 'react-hook-form'

interface CategorySelectorProps {
    categories: Array<{ id: number; name: string }>
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({ categories }) => {
    const { control } = useFormContext()

    return (
        <div className="mb-6">
            <div className="flex items-center mb-4">
                <label className="mr-3 font-medium text-gray-700">카테고리:</label>
                <Controller
                    name="categoryId"
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            value={field.value}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    )}
                />
            </div>
        </div>
    )
}
