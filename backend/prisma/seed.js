const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed for TTD Balo...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@ttdbalo.com' },
    update: {},
    create: {
      email: 'admin@ttdbalo.com',
      password: adminPassword,
      name: 'Admin TTD Balo',
      role: 'ADMIN',
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Create categories cho balo, túi xách
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'balo' },
      update: {},
      create: { 
        name: 'Balo', 
        slug: 'balo', 
        position: 1,
        imageUrl: '/images/category-balo.jpg'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tui-xach' },
      update: {},
      create: { 
        name: 'Túi Xách', 
        slug: 'tui-xach', 
        position: 2,
        imageUrl: '/images/category-tui-xach.jpg'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tui-cheo' },
      update: {},
      create: { 
        name: 'Túi Chéo', 
        slug: 'tui-cheo', 
        position: 3,
        imageUrl: '/images/category-tui-cheo.jpg'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'vali' },
      update: {},
      create: { 
        name: 'Vali', 
        slug: 'vali', 
        position: 4,
        imageUrl: '/images/category-vali.jpg'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'balo-laptop' },
      update: {},
      create: { 
        name: 'Balo Laptop', 
        slug: 'balo-laptop', 
        position: 5,
        imageUrl: '/images/category-balo-laptop.jpg'
      },
    }),
    prisma.category.upsert({
      where: { slug: 'tui-du-lich' },
      update: {},
      create: { 
        name: 'Túi Du Lịch', 
        slug: 'tui-du-lich', 
        position: 6,
        imageUrl: '/images/category-tui-du-lich.jpg'
      },
    }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Create brands
  const brands = await Promise.all([
    prisma.brand.upsert({
      where: { slug: 'mikkor' },
      update: {},
      create: { name: 'Mikkor', slug: 'mikkor', imageUrl: '/images/brand-mikkor.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'tomtoc' },
      update: {},
      create: { name: 'Tomtoc', slug: 'tomtoc', imageUrl: '/images/brand-tomtoc.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'sakos' },
      update: {},
      create: { name: 'Sakos', slug: 'sakos', imageUrl: '/images/brand-sakos.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'the-north-face' },
      update: {},
      create: { name: 'The North Face', slug: 'the-north-face', imageUrl: '/images/brand-tnf.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'jansport' },
      update: {},
      create: { name: 'JanSport', slug: 'jansport', imageUrl: '/images/brand-jansport.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'adidas' },
      update: {},
      create: { name: 'Adidas', slug: 'adidas', imageUrl: '/images/brand-adidas.png' },
    }),
    prisma.brand.upsert({
      where: { slug: 'nike' },
      update: {},
      create: { name: 'Nike', slug: 'nike', imageUrl: '/images/brand-nike.png' },
    }),
  ]);
  console.log('✅ Brands created:', brands.length);

  // Create tags
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { slug: 'chong-nuoc' },
      update: {},
      create: { name: 'Chống Nước', slug: 'chong-nuoc' },
    }),
    prisma.tag.upsert({
      where: { slug: 'thoi-trang' },
      update: {},
      create: { name: 'Thời Trang', slug: 'thoi-trang' },
    }),
    prisma.tag.upsert({
      where: { slug: 'the-thao' },
      update: {},
      create: { name: 'Thể Thao', slug: 'the-thao' },
    }),
    prisma.tag.upsert({
      where: { slug: 'van-phong' },
      update: {},
      create: { name: 'Văn Phòng', slug: 'van-phong' },
    }),
    prisma.tag.upsert({
      where: { slug: 'du-lich' },
      update: {},
      create: { name: 'Du Lịch', slug: 'du-lich' },
    }),
    prisma.tag.upsert({
      where: { slug: 'hoc-sinh' },
      update: {},
      create: { name: 'Học Sinh', slug: 'hoc-sinh' },
    }),
    prisma.tag.upsert({
      where: { slug: 'cao-cap' },
      update: {},
      create: { name: 'Cao Cấp', slug: 'cao-cap' },
    }),
  ]);
  console.log('✅ Tags created:', tags.length);

  // Create sample products (Balo, Túi, Vali)
  const products = [
    {
      name: 'Balo Laptop The North Face Recon',
      slug: 'balo-laptop-the-north-face-recon',
      sku: 'BALO001',
      shortDesc: 'Balo laptop cao cấp, chống nước, ngăn đựng laptop 15.6 inch',
      longDesc: 'Balo The North Face Recon với thiết kế chuyên dụng cho laptop, chống nước tốt, nhiều ngăn tiện lợi. Phù hợp cho dân văn phòng, sinh viên.',
      price: 2890000,
      stock: 50,
      categoryId: categories[4].id, // Balo Laptop
      brandId: brands[3].id, // The North Face
      featured: true,
      images: {
        create: [
          { url: '/images/products/balo-tnf-recon-1.jpg', isPrimary: true, position: 0 },
          { url: '/images/products/balo-tnf-recon-2.jpg', isPrimary: false, position: 1 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: 'One Size', sku: 'BALO001-BLACK', price: 2890000, stock: 30 },
          { color: 'Xám', size: 'One Size', sku: 'BALO001-GREY', price: 2890000, stock: 20 },
        ],
      },
    },
    {
      name: 'Balo Adidas Classic',
      slug: 'balo-adidas-classic',
      sku: 'BALO002',
      shortDesc: 'Balo thể thao phong cách năng động',
      longDesc: 'Balo Adidas Classic với thiết kế đơn giản, năng động. Chất liệu polyester bền bỉ, phù hợp đi học, đi chơi.',
      price: 650000,
      stock: 100,
      categoryId: categories[0].id, // Balo
      brandId: brands[5].id, // Adidas
      featured: true,
      images: {
        create: [
          { url: '/images/products/balo-adidas-classic.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: 'Medium', sku: 'BALO002-BLACK-M', price: 650000, stock: 50 },
          { color: 'Navy', size: 'Medium', sku: 'BALO002-NAVY-M', price: 650000, stock: 30 },
          { color: 'Đỏ', size: 'Medium', sku: 'BALO002-RED-M', price: 650000, stock: 20 },
        ],
      },
    },
    {
      name: 'Túi Xách Nữ Thời Trang',
      slug: 'tui-xach-nu-thoi-trang',
      sku: 'TUIXACH001',
      shortDesc: 'Túi xách nữ da PU cao cấp, thiết kế sang trọng',
      longDesc: 'Túi xách nữ với chất liệu da PU mềm mại, thiết kế thanh lịch. Phù hợp đi làm, đi chơi. Nhiều ngăn tiện dụng.',
      price: 450000,
      stock: 80,
      categoryId: categories[1].id, // Túi Xách
      brandId: brands[0].id,
      featured: true,
      images: {
        create: [
          { url: '/images/products/tui-xach-nu-1.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: 'Medium', sku: 'TUIXACH001-BLACK', price: 450000, stock: 30 },
          { color: 'Nâu', size: 'Medium', sku: 'TUIXACH001-BROWN', price: 450000, stock: 30 },
          { color: 'Hồng', size: 'Medium', sku: 'TUIXACH001-PINK', price: 480000, stock: 20 },
        ],
      },
    },
    {
      name: 'Túi Chéo Nam Da Bò Thật',
      slug: 'tui-cheo-nam-da-bo-that',
      sku: 'TUICHEO001',
      shortDesc: 'Túi đeo chéo nam da bò thật 100%, thời trang và bền bỉ',
      longDesc: 'Túi chéo nam từ da bò thật cao cấp, thiết kế sang trọng, nhiều ngăn đựng đồ tiện lợi. Phù hợp đi làm, đi chơi.',
      price: 890000,
      stock: 45,
      categoryId: categories[2].id, // Túi Chéo
      brandId: brands[0].id,
      images: {
        create: [
          { url: '/images/products/tui-cheo-nam-1.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Nâu Đậm', size: 'Small', sku: 'TUICHEO001-BROWN', price: 890000, stock: 25 },
          { color: 'Đen', size: 'Small', sku: 'TUICHEO001-BLACK', price: 890000, stock: 20 },
        ],
      },
    },
    {
      name: 'Vali Sakos Titan Size 24 inch',
      slug: 'vali-sakos-titan-24-inch',
      sku: 'VALI001',
      shortDesc: 'Vali du lịch cao cấp, khung nhôm chống va đập',
      longDesc: 'Vali Sakos Titan với khung nhôm siêu bền, 4 bánh xe xoay 360 độ êm ái. Khoá TSA an toàn. Dung tích lớn 24 inch phù hợp cho chuyến đi 5-7 ngày.',
      price: 3200000,
      stock: 30,
      categoryId: categories[3].id, // Vali
      brandId: brands[2].id, // Sakos
      featured: true,
      images: {
        create: [
          { url: '/images/products/vali-sakos-titan.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Bạc', size: '24 inch', sku: 'VALI001-SILVER-24', price: 3200000, stock: 10 },
          { color: 'Đen', size: '24 inch', sku: 'VALI001-BLACK-24', price: 3200000, stock: 10 },
          { color: 'Xanh Navy', size: '24 inch', sku: 'VALI001-NAVY-24', price: 3200000, stock: 10 },
        ],
      },
    },
    {
      name: 'Túi Du Lịch Mikkor The Norris',
      slug: 'tui-du-lich-mikkor-the-norris',
      sku: 'TUIDL001',
      shortDesc: 'Túi du lịch đa năng, chống nước, có ngăn giày riêng',
      longDesc: 'Túi du lịch Mikkor với thiết kế thông minh: ngăn giày riêng, chống nước tốt, dây đeo vai êm ái. Dung tích 40L phù hợp cho chuyến đi ngắn.',
      price: 1250000,
      stock: 60,
      categoryId: categories[5].id, // Túi Du Lịch
      brandId: brands[0].id, // Mikkor
      images: {
        create: [
          { url: '/images/products/tui-du-lich-mikkor.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: '40L', sku: 'TUIDL001-BLACK', price: 1250000, stock: 30 },
          { color: 'Xám', size: '40L', sku: 'TUIDL001-GREY', price: 1250000, stock: 30 },
        ],
      },
    },
    {
      name: 'Balo JanSport Superbreak Plus',
      slug: 'balo-jansport-superbreak-plus',
      sku: 'BALO003',
      shortDesc: 'Balo học sinh cổ điển, bền bỉ',
      longDesc: 'Balo JanSport Superbreak Plus - mẫu balo cổ điển được yêu thích nhất. Thiết kế đơn giản, chắc chắn, bảo hành trọn đời.',
      price: 890000,
      stock: 150,
      categoryId: categories[0].id, // Balo
      brandId: brands[4].id, // JanSport
      images: {
        create: [
          { url: '/images/products/balo-jansport.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: 'Standard', sku: 'BALO003-BLACK', price: 890000, stock: 50 },
          { color: 'Navy', size: 'Standard', sku: 'BALO003-NAVY', price: 890000, stock: 50 },
          { color: 'Đỏ Đô', size: 'Standard', sku: 'BALO003-RED', price: 890000, stock: 50 },
        ],
      },
    },
    {
      name: 'Balo Tomtoc Laptop 16 inch',
      slug: 'balo-tomtoc-laptop-16-inch',
      sku: 'BALO004',
      shortDesc: 'Balo laptop cao cấp, bảo vệ tối ưu cho Macbook/Laptop',
      longDesc: 'Balo Tomtoc với lớp đệm A50 Flexy-Armor bảo vệ tối đa cho laptop. Ngăn chống sốc 360 độ, chống nước. Thiết kế tối giản, sang trọng.',
      price: 1890000,
      stock: 40,
      categoryId: categories[4].id, // Balo Laptop
      brandId: brands[1].id, // Tomtoc
      featured: true,
      images: {
        create: [
          { url: '/images/products/balo-tomtoc.jpg', isPrimary: true, position: 0 },
        ],
      },
      variants: {
        create: [
          { color: 'Đen', size: '16 inch', sku: 'BALO004-BLACK-16', price: 1890000, stock: 20 },
          { color: 'Xám', size: '16 inch', sku: 'BALO004-GREY-16', price: 1890000, stock: 20 },
        ],
      },
    },
  ];

  for (const productData of products) {
    await prisma.product.upsert({
      where: { sku: productData.sku },
      update: {},
      create: productData,
    });
  }
  console.log('✅ Products created:', products.length);

  // Create sample banners
  await prisma.banner.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Chào mừng đến với TTD Balo',
      imageUrl: '/images/banner-balo-main.jpg',
      link: '/products',
      position: 'hero',
      active: true,
      order: 1,
    },
  });

  await prisma.banner.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Balo Laptop - Giảm 20%',
      imageUrl: '/images/banner-laptop-sale.jpg',
      link: '/products?category=balo-laptop',
      position: 'sidebar',
      active: true,
      order: 2,
    },
  });
  console.log('✅ Banners created');

  // Create sample discount codes
  await prisma.discount.upsert({
    where: { code: 'CHAOBAN2024' },
    update: {},
    create: {
      code: 'CHAOBAN2024',
      type: 'PERCENT',
      value: 10,
      minOrder: 500000,
      usageLimit: 100,
      active: true,
    },
  });

  await prisma.discount.upsert({
    where: { code: 'FREESHIP' },
    update: {},
    create: {
      code: 'FREESHIP',
      type: 'FIXED',
      value: 30000,
      minOrder: 1000000,
      usageLimit: 50,
      active: true,
    },
  });
  console.log('✅ Discounts created');

  // Create sample blog post
  await prisma.blogPost.upsert({
    where: { slug: 'cach-chon-balo-laptop-phu-hop' },
    update: {},
    create: {
      title: 'Cách chọn balo laptop phù hợp',
      slug: 'cach-chon-balo-laptop-phu-hop',
      excerpt: 'Hướng dẫn chi tiết cách chọn balo laptop phù hợp với nhu cầu sử dụng',
      content: 'Nội dung bài viết về cách chọn balo laptop...',
      coverUrl: '/images/blog/chon-balo-laptop.jpg',
      published: true,
    },
  });
  console.log('✅ Blog post created');

  console.log('\n🎉 Seed completed for TTD Balo!');
  console.log('\n📝 Admin credentials:');
  console.log('Email: admin@ttdbalo.com');
  console.log('Password: admin123');
  console.log('\n💰 Discount codes:');
  console.log('- CHAOBAN2024: Giảm 10% cho đơn từ 500k');
  console.log('- FREESHIP: Giảm 30k ship cho đơn từ 1tr');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
