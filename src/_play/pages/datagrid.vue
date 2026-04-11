<script setup lang="tsx">
import { NEllipsis } from 'naive-ui'
import { DataGrid, buildGridSchema } from '@/index'

type Product = {
  name: string
  price: number
  stock: number
  images: string[]
  seller: {
    name: string
    email: string
  }
  description: string
}

const product: Product = {
  name: 'Product 1',
  price: 100,
  stock: 10,
  images: ['https://picsum.photos/200/300'],
  seller: {
    name: 'Seller 1',
    email: 'seller1@email.com',
  },
  // LONG DESCRIPTION
  description: `Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.`,

}
const schema = buildGridSchema<Product>({
  fields: [
    { key: 'name', label: 'Name' },
    { key: 'price', label: 'Price' },
    { key: 'stock', label: 'Stock' },
    { key: 'images', label: 'Images', render: ({ data }) => `${data.images.length} images` },
    { key: 'seller', label: 'Seller', render: ({ data }) => `${data.seller.name} (${data.seller.email})` },
    { key: 'description', label: 'Description', render: ({ data }) => <NEllipsis>{data.description}</NEllipsis>, fitWidth: false },
  ],
})
</script>

<template>
  <DataGrid v-bind="schema" :data="product" />
</template>
