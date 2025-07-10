<template>
  <div class="product-list">
    <div class="header">
      <h1 class="title">Lista de Medicamentos para este Lote</h1>
    </div>

    <div class="card">
      <DataTable :value="products" tableStyle="min-width: 60rem" stripedRows>
        <template #header>
          <div class="table-header">
            <div class="header-left">
              <span class="table-title">Productos</span>
              <span class="product-count">{{ products.length }} elementos</span>
              <Button
                  icon="pi pi-plus"
                  label="Agregar"
                  class="add-btn"
                  @click="openAddProductDialog"
              />
            </div>
            <Button
                icon="pi pi-refresh"
                rounded
                raised
                @click="fetchProducts"
                class="refresh-btn"
            />
          </div>
        </template>

        <Column field="name" header="Nombre"></Column>
        <Column header="Imagen">
          <template #body="slotProps">
            <img
                :src="slotProps.data.image"
                :alt="slotProps.data.name"
                class="product-image"
            />
          </template>
        </Column>

        <Column field="description" header="Descripción"></Column>
        <Column field="serialNumber" header="N° de Serie"></Column>
        <Column field="productTypeName" header="Tipo de Producto"></Column>
        <Column field="productTypeManufacturer" header="Fabricante"></Column>
        <Column field="manufactureDate" header="Fabricación"></Column>
        <Column field="expirationDate" header="Expiración"></Column>
        <Column field="composition" header="Composición"></Column>

        <!-- Nueva columna para el QR -->
        <Column header="QR">
          <template #body="slotProps">
            <img
                :src="'data:image/png;base64,' + slotProps.data.qrCodeBase64"
                alt="QR Code"
                class="qr-code-image"
                @click="showQrPopup(slotProps.data.qrCodeBase64)"
            />
          </template>
        </Column>

        <Dialog v-model:visible="qrDialogVisible" :modal="true" :closable="true" :style="{ width: '300px' }">
          <template #header>
            <h3>Escanea el Código QR</h3>
          </template>
          <div class="qr-popup-content">
            <img :src="'data:image/png;base64,' + selectedQrCode" alt="QR Code" class="qr-popup-image" />
          </div>
        </Dialog>

        <template #footer>
          <div class="table-footer">
            Total: {{ products.length }} productos
          </div>
        </template>
      </DataTable>
    </div>

    <!-- Diálogo para agregar producto -->
    <AddProductToBatch
        :visible="addProductDialogVisible"
        :batchCode="batchCode"
        @update:visible="addProductDialogVisible = $event"
        @productAdded="fetchProducts"
    />
  </div>
</template>

<script>
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import AddProductToBatch from '@/components/AddProductToBatch.vue';
import api from '@/services/api';

export default {
  name: "ListProducts",
  components: {
    DataTable,
    Column,
    Button,
    AddProductToBatch,
  },
  data() {
    return {
      products: [],
      addProductDialogVisible: false,
      qrDialogVisible: false,
      selectedQrCode: "",
    };
  },
  computed: {
    batchCode() {
      return this.$route.query.code;
    },
  },
  methods: {
    showQrPopup(qrCodeBase64) {
      this.selectedQrCode = qrCodeBase64;
      this.qrDialogVisible = true;
    },
    async fetchProducts() {
      try {
        if (!this.batchCode) {
          throw new Error("El parámetro 'code' es requerido pero no se proporcionó.");
        }
        const response = await api.getProducts({ code: this.batchCode });
        this.products = response.data;
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    },
    openAddProductDialog() {
      this.addProductDialogVisible = true;
    },
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>

<style scoped>
.product-list {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.header {
  margin-bottom: 2rem;
  text-align: center;
}

.title {
  font-size: 2.5rem;
  font-weight: 300;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.5px;
}

.card {
  background: #ffffff;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e2e8f0;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.table-title {
  font-size: 1.25rem;
  font-weight: 500;
  color: #1e293b;
}

.product-count {
  background: #f1f5f9;
  color: #475569;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-image {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}

.qr-code-image {
  width: 60px;
  height: 60px;
  object-fit: contain;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.qr-code-image:hover {
  transform: scale(1.1);
}

.qr-popup-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}

.qr-popup-image {
  width: 100%;
  height: auto;
  max-width: 250px;
  border-radius: 8px;
}

.table-footer {
  padding: 1rem 0;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
  border-top: 1px solid #e2e8f0;
}

.add-btn {
  background-color: #1457ff;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

/* SOLUCIÓN ESPECÍFICA PARA TEMA OSCURO */
/* Forzar colores claros solo en elementos necesarios, manteniendo el layout */

:deep(.p-datatable) {
  border: none;
  background: transparent;
}

:deep(.p-datatable-header) {
  background: transparent;
  border: none;
  padding: 0;
}

/* Header de columnas - forzar color claro */
:deep(.p-datatable-thead > tr > th) {
  background: #f8fafc !important;
  color: #374151 !important;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #e2e8f0;
}

/* Cuerpo de la tabla - forzar fondo blanco */
:deep(.p-datatable-tbody > tr > td) {
  padding: 1rem;
  border: none;
  border-bottom: 1px solid #f1f5f9;
  background: white !important;
  color: #374151 !important;
}

/* Filas striped - mantener patrón claro */
:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even) > td) {
  background: #f9fafb !important;
}

/* Hover states - color claro uniforme */
:deep(.p-datatable-tbody > tr:hover > td) {
  background: #f1f5f9 !important;
  color: #374151 !important;
}

:deep(.p-datatable-striped .p-datatable-tbody > tr:nth-child(even):hover > td) {
  background: #f1f5f9 !important;
  color: #374151 !important;
}

/* Footer de tabla - fondo claro */
:deep(.p-datatable-footer) {
  background: transparent;
  border: none;
  padding: 0;
}

/* Mensaje de tabla vacía - si no hay datos */
:deep(.p-datatable-emptymessage > td) {
  background: white !important;
  color: #64748b !important;
  text-align: center;
  padding: 3rem 1rem;
}

/* Responsive */
@media (max-width: 768px) {
  .product-list {
    padding: 1rem;
  }

  .title {
    font-size: 2rem;
  }

  .card {
    padding: 1rem;
  }

  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
  }
}
</style>