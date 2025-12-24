
import React, { useState, useEffect, useMemo } from 'react';
import { ViewMode, Product, PalletPosition, Stats, CatalogItem } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import InventoryList from './components/InventoryList';
import ReceiveGoodsForm from './components/ReceiveGoodsForm';
import DispatchGoodsForm from './components/DispatchGoodsForm';
import WarehouseMap from './components/WarehouseMap';
import ProductRegistration from './components/ProductRegistration';
import LocationSetup from './components/LocationSetup';
import Reports from './components/Reports';

const App: React.FC = () => {
  const [view, setView] = useState<ViewMode>(ViewMode.DASHBOARD);
  const [positions, setPositions] = useState<PalletPosition[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [catalog, setCatalog] = useState<CatalogItem[]>([]);

  const stats: Stats = useMemo(() => ({
    totalPositions: positions.length,
    occupiedPositions: positions.filter(p => p.isOccupied).length,
    totalProducts: products.reduce((acc, p) => acc + p.quantity, 0),
    recentEntries: products.slice(-5).reverse()
  }), [positions, products]);

  const handleReceiveGoods = (newProduct: Product) => {
    // Verificar se a posição já está ocupada por outro produto antes de permitir a entrada
    const targetPos = positions.find(p => p.id === newProduct.positionId);
    
    // Regra: Não permitir entrada se a posição estiver ocupada, a menos que seja o EXATO mesmo SKU e LOTE (opcional, mas o usuário pediu para não arriscar entrada com outro produto)
    if (targetPos?.isOccupied) {
      const alreadyThere = products.find(p => p.positionId === newProduct.positionId);
      if (alreadyThere && (alreadyThere.sku !== newProduct.sku || alreadyThere.lotNumber !== newProduct.lotNumber)) {
        return alert('Este endereço já está ocupado por outro produto/lote.');
      }
    }

    const existingIndex = products.findIndex(p => 
      p.sku === newProduct.sku && 
      p.positionId === newProduct.positionId && 
      p.lotNumber === newProduct.lotNumber
    );
    
    if (existingIndex > -1) {
      const updatedProducts = [...products];
      updatedProducts[existingIndex].quantity += newProduct.quantity;
      setProducts(updatedProducts);
    } else {
      setProducts(prev => [...prev, newProduct]);
      setPositions(prev => prev.map(p => 
        p.id === newProduct.positionId ? { ...p, isOccupied: true, productId: newProduct.id } : p
      ));
    }
    setView(ViewMode.INVENTORY);
  };

  const handleDispatchGoods = (sku: string, positionId: string, quantity: number) => {
    const productIndex = products.findIndex(p => p.sku === sku && p.positionId === positionId);
    if (productIndex === -1) return;

    const updatedProducts = [...products];
    const product = updatedProducts[productIndex];

    if (quantity >= product.quantity) {
      updatedProducts.splice(productIndex, 1);
      // Ao remover totalmente o saldo, verificamos se sobrou algo daquela posição
      const remainingInPos = updatedProducts.some(p => p.positionId === positionId);
      if (!remainingInPos) {
        setPositions(prev => prev.map(p => 
          p.id === positionId ? { ...p, isOccupied: false, productId: undefined } : p
        ));
      }
    } else {
      product.quantity -= quantity;
    }

    setProducts(updatedProducts);
  };

  const handleRegisterCatalogItem = (newItem: CatalogItem) => {
    setCatalog(prev => [...prev, newItem]);
  };

  const handleRemoveProduct = (productId: string, positionId: string) => {
    const updatedProducts = products.filter(p => p.id !== productId);
    setProducts(updatedProducts);
    
    const remainingInPos = updatedProducts.some(p => p.positionId === positionId);
    if (!remainingInPos) {
      setPositions(prev => prev.map(p => 
        p.id === positionId ? { ...p, isOccupied: false, productId: undefined } : p
      ));
    }
  };

  const handleAddPosition = (pos: PalletPosition) => {
    setPositions(prev => [...prev, pos].sort((a,b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })));
  };

  const handleDeletePosition = (id: string) => {
    setPositions(prev => prev.filter(p => p.id !== id));
  };

  const handleBulkAddPositions = (prefix: string, aisleNum: string, startSlot: number, endSlot: number, startLevel: number, endLevel: number) => {
    const newBatch: PalletPosition[] = [];
    
    for (let s = startSlot; s <= endSlot; s++) {
      for (let l = startLevel; l <= endLevel; l++) {
        const slotStr = s.toString().padStart(2, '0');
        const levelStr = l.toString().padStart(3, '0');
        const id = `${prefix}${aisleNum}.${slotStr}.${levelStr}`;
        
        if (!positions.some(p => p.id === id)) {
          newBatch.push({
            id,
            aisle: aisleNum,
            level: l,
            slot: s,
            isOccupied: false
          });
        }
      }
    }
    
    setPositions(prev => [...prev, ...newBatch].sort((a,b) => a.id.localeCompare(b.id, undefined, { numeric: true, sensitivity: 'base' })));
    alert(`${newBatch.length} novas posições criadas!`);
  };

  const renderView = () => {
    switch (view) {
      case ViewMode.DASHBOARD: return <Dashboard stats={stats} products={products} />;
      case ViewMode.INVENTORY: return <InventoryList products={products} onRemove={handleRemoveProduct} />;
      case ViewMode.RECEIVE: return <ReceiveGoodsForm catalog={catalog} availablePositions={positions} onSubmit={handleReceiveGoods} />;
      case ViewMode.DISPATCH: return <DispatchGoodsForm products={products} onDispatch={handleDispatchGoods} />;
      case ViewMode.MAP: return <WarehouseMap positions={positions} products={products} />;
      case ViewMode.CATALOG: return <ProductRegistration catalog={catalog} onRegister={handleRegisterCatalogItem} />;
      case ViewMode.CONFIG_LOCATIONS: return <LocationSetup positions={positions} onAddPosition={handleAddPosition} onDeletePosition={handleDeletePosition} onBulkAdd={handleBulkAddPositions} />;
      case ViewMode.REPORTS: return <Reports products={products} />;
      default: return <Dashboard stats={stats} products={products} />;
    }
  };

  return <Layout activeView={view} onNavigate={setView}>{renderView()}</Layout>;
};

export default App;
