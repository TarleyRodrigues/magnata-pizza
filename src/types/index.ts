// ─────────────────────────────────────────────
// DATABASE TYPES (mapeiam as tabelas do Supabase)
// ─────────────────────────────────────────────

export type UserRole    = 'customer' | 'admin' | 'owner'
export type PizzaSize   = 'P' | 'M' | 'G'
export type PizzaTier   = 'standard' | 'especial' | 'premium' | 'ultra' | 'doce'
export type ExtraType   = 'bebida' | 'molho'
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'delivering' | 'delivered' | 'cancelled'

export interface Profile {
  id:          string
  name:        string
  phone:       string
  address:     string
  address_ref: string | null
  role:        UserRole
  is_active:   boolean
  created_at:  string
  updated_at:  string
}

export interface Category {
  id:            string
  name:          string
  slug:          string
  description:   string | null
  display_order: number
  is_active:     boolean
}

export interface PizzaPrice {
  id:       string
  pizza_id: string
  size:     PizzaSize
  price:    number
}

export interface Pizza {
  id:            string
  category_id:   string
  name:          string
  description:   string
  tier:          PizzaTier
  is_promotional: boolean
  allowed_sizes: PizzaSize[]
  is_spicy:      boolean
  is_available:  boolean
  image_url:     string | null
  display_order: number
  // Joined
  category?:     Category
  prices?:       PizzaPrice[]
}

export interface Borda {
  id:           string
  name:         string
  price:        number
  flavors:      string[]
  is_available: boolean
  display_order: number
}

export interface Adicional {
  id:           string
  name:         string
  price:        number
  is_available: boolean
  display_order: number
}

export interface Extra {
  id:           string
  name:         string
  type:         ExtraType
  price:        number
  is_available: boolean
  display_order: number
}

export interface Order {
  id:               string
  number:           number
  user_id:          string
  status:           OrderStatus
  pay_method:       string | null
  subtotal:         number
  total:            number
  notes:            string | null
  delivery_address: string
  delivery_ref:     string | null
  delivery_phone:   string
  delivery_name:    string
  confirmed_at:     string | null
  preparing_at:     string | null
  delivering_at:    string | null
  delivered_at:     string | null
  cancelled_at:     string | null
  created_at:       string
  updated_at:       string
  // Joined
  items?:           OrderItem[]
  order_extras?:    OrderExtra[]
}

export interface OrderItem {
  id:             string
  order_id:       string
  pizza_name:     string
  is_half_half:   boolean
  size:           PizzaSize
  qty:            number
  unit_price:     number
  total_price:    number
  borda_name:     string | null
  borda_flavor:   string | null
  borda_price:    number | null
  adicionais_json: AdicionalSnapshot[]
}

export interface AdicionalSnapshot {
  name:  string
  price: number
}

export interface OrderExtra {
  id:          string
  order_id:    string
  extra_name:  string
  extra_type:  ExtraType
  qty:         number
  unit_price:  number
  total_price: number
}

// ─────────────────────────────────────────────
// CART TYPES (estado local, não persiste no DB)
// ─────────────────────────────────────────────

export interface CartBorda {
  name:   string
  flavor: string | null
  price:  number
}

export interface CartItem {
  cartId:      string   // uuid gerado no client
  pizzaName:   string   // "Calabresa" ou "Calabresa / Frango Barbecue"
  isHalfHalf:  boolean
  size:        PizzaSize
  qty:         number
  unitPrice:   number
  totalPrice:  number
  borda:       CartBorda | null
  adicionais:  AdicionalSnapshot[]
}

export interface CartExtra {
  id:    string
  name:  string
  type:  ExtraType
  price: number
  qty:   number
}

// ─────────────────────────────────────────────
// SYSTEM CONFIG
// ─────────────────────────────────────────────

export interface SystemConfig {
  half_half_rule: 'max' | 'avg'
  store_open:     boolean
  hero_image_url: string | null
  pix_key:        string
  store_phone:    string
  store_address:  string
  delivery_fee: {
    value:      number
    free_above: number
    message:    string
  }
  opening_hours: Record<string, string | null>
}

// ─────────────────────────────────────────────
// FORM TYPES
// ─────────────────────────────────────────────

export interface RegisterFormData {
  name:            string
  email:           string
  password:        string
  confirmPassword: string
  phone:           string
  address:         string
  address_ref:     string
}

export interface LoginFormData {
  email:    string
  password: string
}

export interface CreateOrderPayload {
  items:      CartItem[]
  extras:     CartExtra[]
  pay_method: string
  notes?:     string
}
