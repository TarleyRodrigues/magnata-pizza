-- ============================================================
-- PIZZARIA MAGNATA — Migration 002: Seed Completo
-- ============================================================

-- ─────────────────────────────────────────────
-- CATEGORIES
-- ─────────────────────────────────────────────
insert into categories (name, slug, description, display_order) values
  ('Salgadas',     'salgadas',     'Pizzas salgadas com ingredientes frescos', 1),
  ('Doces',        'doces',        'Pizzas doces irresistíveis', 2),
  ('Promocionais', 'promocionais', 'Magnata para Todos — promoções especiais', 3);

-- ─────────────────────────────────────────────
-- PIZZAS SALGADAS (com preços)
-- ─────────────────────────────────────────────
with cat as (select id from categories where slug = 'salgadas')
insert into pizzas (category_id, name, description, tier, is_spicy, display_order) values
  ((select id from cat), 'Calabresa',                        'Molho, mussarela, calabresa fatiada, cebola, azeitona e orégano.',                                              'standard', false,  1),
  ((select id from cat), 'Frango com Requeijão Cremoso',     'Molho, mussarela, frango desfiado, generosa camada de requeijão cremoso, azeitona e orégano.',                  'standard', false,  2),
  ((select id from cat), 'Frango com Bacon e Requeijão',     'Molho, mussarela, frango desfiado, requeijão cremoso, bacon crocante e orégano.',                               'standard', false,  3),
  ((select id from cat), 'Frango com Cheddar',               'Molho, mussarela, frango desfiado, cobertura de Cheddar, palmito e orégano.',                                   'standard', false,  4),
  ((select id from cat), 'Presunto',                         'Molho, mussarela, presunto, tomate, palmito, azeitona e orégano.',                                              'standard', false,  5),
  ((select id from cat), 'Quatro Queijos',                   'Molho, mussarela, requeijão cremoso, provolone, parmesão e orégano.',                                           'standard', false,  6),
  ((select id from cat), 'Atum',                             'Molho, mussarela, atum, azeitona, orégano e cebola.',                                                           'standard', false,  7),
  ((select id from cat), 'Mussarela',                        'Molho, mussarela, tomate fresco e orégano.',                                                                    'standard', false,  8),
  ((select id from cat), 'Italiana',                         'Molho, mussarela, pepperoni, tomate seco, azeitona e orégano.',                                                 'standard', false,  9),
  ((select id from cat), 'Carne de Sol',                     'Molho, mussarela, carne seca, requeijão cremoso e azeitona.',                                                   'especial', false, 10),
  ((select id from cat), 'Napolitana Bacon',                 'Molho, mussarela, bacon fatiado, palmito, azeitona e orégano.',                                                 'standard', false, 11),
  ((select id from cat), 'Margherita',                       'Molho, mussarela, tomate, manjericão e orégano.',                                                               'standard', false, 12),
  ((select id from cat), 'Pepperoni',                        'Molho, mussarela, pepperoni, cebola e orégano.',                                                                'standard', false, 13),
  ((select id from cat), 'Frango Cremoso',                   'Molho, mussarela, frango desfiado, creme de leite, azeitona, palmito e orégano.',                               'standard', false, 14),
  ((select id from cat), 'Francesa',                         'Molho, mussarela, lombo canadense, creme de leite, gema de ovo e orégano.',                                    'standard', false, 15),
  ((select id from cat), 'Vegetariana',                      'Molho, mussarela, tomate, champignon, ervilha, palmito, milho, azeitona, brócolis e orégano.',                  'standard', false, 16),
  ((select id from cat), 'À Moda',                           'Molho, mussarela, frango desfiado, presunto, tomate, requeijão cremoso, milho, azeitona e orégano.',            'standard', false, 17),
  ((select id from cat), 'Americana',                        'Molho, mussarela, calabresa, presunto, bacon, ovo, azeitona e orégano.',                                        'standard', false, 18),
  ((select id from cat), 'Portuguesa',                       'Molho, presunto, mussarela, ervilha, ovo, cebola, pimentão, azeitona e orégano.',                               'standard', false, 19),
  ((select id from cat), 'Pizza da Casa',                    'Molho, mussarela, frango desfiado, champignon, abacaxi, tomate seco e palmito.',                                 'standard', false, 20),
  ((select id from cat), 'Pizza do Magnata',                 'Molho, mussarela, lombo canadense, ovo, abacaxi, cebola, azeitona e orégano.',                                  'standard', false, 21),
  ((select id from cat), 'Frango Barbecue',                  'Molho, mussarela, frango desfiado, bacon, coberto por Molho Barbecue e orégano.',                               'standard', false, 22),
  ((select id from cat), 'Calabresa Suprema',                'Molho, mussarela, calabresa, requeijão cremoso, cebola, azeitona e orégano.',                                   'standard', false, 23),
  ((select id from cat), 'Pizza Baiana',                     'Molho, mussarela, calabresa, tomate, cebola, pimenta de cheiro, molho de pimenta suave, pimenta calabresa, ovo e orégano.', 'standard', true,  24),
  ((select id from cat), 'Du Chefe',                         'Molho, mussarela, lombo canadense, bacon, abacaxi, cebola e orégano.',                                          'standard', false, 25),
  ((select id from cat), 'Bacon com Brócolis',               'Molho, mussarela, bacon, brócolis, palmito, azeitona e orégano.',                                               'standard', false, 26),
  ((select id from cat), 'Strogonoff de Frango',             'Molho, mussarela, frango, strogonoff caseiro, palmito, azeitona e orégano. Finalizada com batata palha.',        'especial', false, 27),
  ((select id from cat), 'Sol Nordestino',                   'Molho, mussarela, carne de sol, cebola, banana da terra e orégano.',                                            'premium',  false, 28),
  ((select id from cat), 'Carne de Sol com Pimenta Biquinho','Molho, mussarela, carne de sol, cream cheese, orégano. Finalizada com cebolinha e pimenta biquinho.',            'premium',  true,  29),
  ((select id from cat), 'Strogonoff de Filé Mignon',        'Molho, mussarela, filé mignon, molho de strogonoff, palmito, azeitona e orégano. Finalizada com batata palha.', 'ultra',    false, 30),
  ((select id from cat), 'Filé Mignon do Magnata',           'Molho, mussarela, requeijão cremoso, filé mignon, parmesão e alho poró.',                                       'ultra',    false, 31);

-- Preços das pizzas salgadas
insert into pizza_prices (pizza_id, size, price)
select p.id, s.size::pizza_size, s.price
from pizzas p
cross join (values
  ('standard', 'P', 45.00), ('standard', 'M', 50.00), ('standard', 'G', 60.00),
  ('especial',  'P', 50.00), ('especial',  'M', 55.00), ('especial',  'G', 65.00),
  ('premium',  'P', 60.00), ('premium',  'M', 65.00), ('premium',  'G', 75.00),
  ('ultra',    'P', 65.00), ('ultra',    'M', 70.00), ('ultra',    'G', 80.00)
) as s(tier_name, size, price)
where p.tier::text = s.tier_name
  and p.is_promotional = false
  and p.category_id = (select id from categories where slug = 'salgadas');

-- ─────────────────────────────────────────────
-- PIZZAS DOCES
-- ─────────────────────────────────────────────
with cat as (select id from categories where slug = 'doces')
insert into pizzas (category_id, name, description, tier, display_order) values
  ((select id from cat), 'Banana com Canela',       'Mussarela, fatias de banana, leite condensado, polvilhada com açúcar e canela.',  'doce', 1),
  ((select id from cat), 'Mineira',                 'Mussarela, fatias de banana, doce de leite e cream cheese.',                      'doce', 2),
  ((select id from cat), 'Romeu e Julieta',          'Mussarela e generosa camada de goiabada cremosa.',                                'doce', 3),
  ((select id from cat), 'Banana com Chocolate',    'Chocolate cremoso e fatias de banana.',                                           'doce', 4),
  ((select id from cat), 'Chocolate e Morango',     'Chocolate cremoso e fatias de morango fresco.',                                   'doce', 5),
  ((select id from cat), 'Morango Trufado',         'Chocolate cremoso, chocolate branco e morangos frescos.',                         'doce', 6),
  ((select id from cat), 'Chocolate com M&Ms',      'Chocolate cremoso e confeitos coloridos de M&Ms.',                               'doce', 7),
  ((select id from cat), 'Uva Verde com Leitinho',  'Cobertura cremosa sabor Leite Ninho e uvas verdes sem semente.',                  'doce', 8),
  ((select id from cat), 'Brigadeiro',              'Chocolate cremoso e finalizada com chocolate granulado especial.',                 'doce', 9);

-- Preços das pizzas doces
insert into pizza_prices (pizza_id, size, price)
select p.id, unnest(array['P','M','G'])::pizza_size, unnest(array[45.00, 50.00, 60.00])
from pizzas p
where p.tier = 'doce';

-- ─────────────────────────────────────────────
-- PIZZAS PROMOCIONAIS (Magnata para Todos)
-- ─────────────────────────────────────────────
with cat as (select id from categories where slug = 'promocionais')
insert into pizzas (category_id, name, description, tier, is_promotional, allowed_sizes, display_order) values
  ((select id from cat), 'Frango com Milho', 'Molho de tomate, mussarela, frango, tomate, milho, azeitona e orégano.', 'standard', true, array['G']::pizza_size[], 1),
  ((select id from cat), 'Mussarela',        'Molho de tomate, mussarela, tomate, azeitona e orégano.',                'standard', true, array['G']::pizza_size[], 2),
  ((select id from cat), 'Presunto',         'Molho de tomate, mussarela, presunto, tomate, azeitona e orégano.',      'standard', true, array['G']::pizza_size[], 3);

-- Preços das pizzas promocionais
insert into pizza_prices (pizza_id, size, price)
select p.id, 'G'::pizza_size, 45.00
from pizzas p
where p.is_promotional = true;

-- ─────────────────────────────────────────────
-- BORDAS
-- ─────────────────────────────────────────────
insert into bordas (name, price, flavors, display_order) values
  ('Sem Borda',      0.00,  '{}',1),
  ('Borda Simples',  12.00, '{"Requeijão Cremoso","Cheddar","Cream Cheese","Chocolate","Doce de Leite","Goiabada"}', 2),
  ('Borda Especial', 15.00, '{"Mussarela","Trufada"}',3);

-- ─────────────────────────────────────────────
-- ADICIONAIS
-- ─────────────────────────────────────────────
insert into adicionais (name, price, display_order) values
  ('Extra Mussarela',        15.00, 1),
  ('Extra Carne de Sol',     12.00, 2),
  ('Extra Bacon / Calabresa', 6.00, 3),
  ('Extra Vegetais',          3.00, 4);

-- ─────────────────────────────────────────────
-- EXTRAS (Bebidas e Molhos)
-- ─────────────────────────────────────────────
insert into extras (name, type, price, display_order) values
  ('Coca-Cola Original 1L',          'bebida',  10.00,  1),
  ('Coca-Cola Zero 1L',              'bebida',  10.00,  2),
  ('Coca-Cola Original 2L',          'bebida',  15.00,  3),
  ('Coca-Cola Zero 2L',              'bebida',  15.00,  4),
  ('Guaraná Antarctica 1.5L',        'bebida',  10.00,  5),
  ('Guaraná Antarctica Original 2L', 'bebida',  13.00,  6),
  ('Guaraná Antarctica Zero 2L',     'bebida',  13.00,  7),
  ('Mineiro Guaraná 1.5L',           'bebida',   8.00,  8),
  ('Mineiro Guaraná 2L',             'bebida',  10.00,  9),
  ('Sprite Limão 2L',                'bebida',  13.00, 10),
  ('Fanta Laranja 2L',               'bebida',  13.00, 11),
  ('Água Mineral Com Gás 500ml',     'bebida',   3.00, 12),
  ('Água Mineral Sem Gás 500ml',     'bebida',   2.50, 13),
  ('Ketchup + Maionese (4 sachês)',  'molho',    3.00,  1),
  ('Ketchup Heinz Bisnaga',          'molho',   24.00,  2),
  ('Maionese Heinz',                 'molho',   24.00,  3);

-- ─────────────────────────────────────────────
-- SYSTEM CONFIG (valores padrão)
-- ─────────────────────────────────────────────
insert into system_config (key, value) values
  ('half_half_rule',   '"max"'),
  ('store_open',       'true'),
  ('delivery_fee',     '{"value": 0, "free_above": 0, "message": "Consulte o valor com a pizzaria"}'),
  ('pix_key',          '"sua@chave.pix"'),
  ('hero_image_url',   'null'),
  ('opening_hours',    '{"mon":null,"tue":null,"wed":null,"thu":"18:00-23:00","fri":"18:00-23:30","sat":"18:00-23:30","sun":"18:00-23:00"}'),
  ('store_phone',      '"(62) 9 9999-9999"'),
  ('store_address',    '"Goiânia - GO"');
