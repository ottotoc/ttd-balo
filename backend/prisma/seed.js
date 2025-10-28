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

  // Create sample blog posts
  await prisma.blogPost.upsert({
    where: { slug: 'cach-chon-balo-laptop-phu-hop' },
    update: {},
    create: {
      title: 'Cách chọn balo laptop phù hợp cho dân văn phòng',
      slug: 'cach-chon-balo-laptop-phu-hop',
      excerpt: 'Hướng dẫn chi tiết cách chọn balo laptop phù hợp với nhu cầu sử dụng, kích thước và phong cách cá nhân.',
      content: `<h2>Giới thiệu</h2>
<p>Balo laptop là phụ kiện không thể thiếu đối với dân văn phòng, sinh viên hay những người thường xuyên di chuyển. Việc chọn được một chiếc balo phù hợp không chỉ giúp bảo vệ laptop mà còn mang lại sự thoải mái khi sử dụng.</p>

<h2>1. Kích thước phù hợp</h2>
<p>Điều đầu tiên cần quan tâm là kích thước của balo có phù hợp với laptop không. Hầu hết các balo laptop có kích thước từ 13-17 inch.</p>

<h2>2. Chất liệu bền bỉ</h2>
<p>Chất liệu polyester hoặc nylon là lựa chọn tốt vì chống nước và bền bỉ. Một số balo cao cấp còn có lớp đệm chống sốc.</p>

<h2>3. Ngăn chứa hợp lý</h2>
<p>Balo nên có nhiều ngăn để phân loại đồ dùng, ví dụ như ngăn laptop riêng, ngăn đựng chuột, sạc, và các vật dụng cá nhân.</p>

<h2>Kết luận</h2>
<p>Chọn balo laptop phù hợp sẽ giúp bạn làm việc hiệu quả hơn và bảo vệ thiết bị tốt hơn. Hãy cân nhắc kỹ các yếu tố trên trước khi quyết định mua.</p>`,
      coverUrl: '/images/post-thumb-1.jpg',
      published: true,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'top-5-tui-xach-nu-thoi-trang' },
    update: {},
    create: {
      title: 'Top 5 mẫu túi xách nữ thời trang hot nhất 2024',
      slug: 'top-5-tui-xach-nu-thoi-trang',
      excerpt: 'Khám phá 5 mẫu túi xách nữ được yêu thích nhất năm 2024, từ túi tote đến túi đeo chéo sang trọng.',
      content: `<h2>Túi xách - Phụ kiện thời trang không thể thiếu</h2>
<p>Túi xách không chỉ là nơi đựng đồ mà còn là điểm nhấn quan trọng trong phong cách thời trang của phái nữ.</p>

<h2>1. Túi Tote - Đa năng và tiện lợi</h2>
<p>Túi tote với thiết kế đơn giản, dung lượng lớn, phù hợp cho cả đi làm và đi chơi.</p>

<h2>2. Túi đeo chéo - Năng động</h2>
<p>Giải phóng đôi tay, phong cách trẻ trung và năng động.</p>

<h2>3. Túi xách công sở - Sang trọng</h2>
<p>Thiết kế chuyên nghiệp, chất liệu da cao cấp.</p>

<h2>4. Túi mini - Cá tính</h2>
<p>Nhỏ gọn, dễ thương, phù hợp đi dự tiệc.</p>

<h2>5. Túi bucket - Trendy</h2>
<p>Xu hướng mới, form dáng độc đáo.</p>`,
      coverUrl: '/images/post-thumb-2.jpg',
      published: true,
    },
  });

  await prisma.blogPost.upsert({
    where: { slug: 'huong-dan-bao-quan-balo-dung-cach' },
    update: {},
    create: {
      title: 'Hướng dẫn bảo quản balo đúng cách để bền lâu',
      slug: 'huong-dan-bao-quan-balo-dung-cach',
      excerpt: 'Cách vệ sinh và bảo quản balo để sử dụng lâu dài, luôn như mới.',
      content: `<h2>Tại sao cần bảo quản balo đúng cách?</h2>
<p>Balo được sử dụng thường xuyên nên dễ bị bẩn và hư hỏng. Bảo quản đúng cách sẽ giúp balo bền đẹp hơn.</p>

<h2>1. Vệ sinh định kỳ</h2>
<p>Nên vệ sinh balo ít nhất 1 tháng/lần bằng khăn ẩm hoặc giặt tay nhẹ nhàng.</p>

<h2>2. Tránh ánh nắng trực tiếp</h2>
<p>Ánh nắng mặt trời có thể làm phai màu và hư hỏng chất liệu.</p>

<h2>3. Không để quá tải</h2>
<p>Đựng đồ vừa phải sẽ giúp balo giữ form dáng đẹp.</p>

<h2>4. Bảo quản đúng cách</h2>
<p>Khi không dùng, nên treo balo hoặc để ở nơi khô ráo, thoáng mát.</p>`,
      coverUrl: '/images/post-thumb-3.jpg',
      published: true,
    },
  });

  console.log('✅ Blog posts created');

  // Create sample announcements
  await prisma.announcement.upsert({
    where: { id: 1 },
    update: {},
    create: {
      text: '🎉 SALE OFF TỚI 50% TẤT CẢ SẢN PHẨM BALO - MIỄN PHÍ VẬN CHUYỂN ĐƠN TỪ 500K - ƯU ĐÃI CỰC SỐC CHỈ CÓ TRONG THÁNG NÀY! 🎉',
      active: true,
      position: 1,
    },
  });

  await prisma.announcement.upsert({
    where: { id: 2 },
    update: {},
    create: {
      text: '🔥 MUA 1 TẶNG 1 - ÁP DỤNG CHO TẤT CẢ SẢN PHẨM TÚI XÁCH - NHANH TAY KẺO HẾT! 🔥',
      active: true,
      position: 2,
    },
  });

  await prisma.announcement.upsert({
    where: { id: 3 },
    update: {},
    create: {
      text: '💼 VALI CAO CẤP - GIẢM TỚI 40% - BẢO HÀNH 5 NĂM - CHẤT LƯỢNG HÀNG ĐẦU! 💼',
      active: true,
      position: 3,
    },
  });
  console.log('✅ Announcements created');

  // Create sample TikTok videos
  await prisma.tikTokVideo.upsert({
    where: { id: 1 },
    update: {},
    create: {
      title: 'Balo Laptop Chống Nước Siêu Bền 💦',
      videoUrl: 'https://www.tiktok.com/@ttdbalo/video/1234567890',
      description: 'Review chi tiết balo laptop chống nước cho dân văn phòng',
      active: true,
      position: 0,
    },
  });

  await prisma.tikTokVideo.upsert({
    where: { id: 2 },
    update: {},
    create: {
      title: 'Túi Xách Nữ Thời Trang Hot Trend 👜',
      videoUrl: 'https://www.tiktok.com/@ttdbalo/video/2345678901',
      description: 'Top 5 mẫu túi xách được yêu thích nhất',
      active: true,
      position: 1,
    },
  });

  await prisma.tikTokVideo.upsert({
    where: { id: 3 },
    update: {},
    create: {
      title: 'Vali Du Lịch Size Cabin Sang Xịn ✈️',
      videoUrl: 'https://www.tiktok.com/@ttdbalo/video/3456789012',
      description: 'Hướng dẫn chọn vali du lịch phù hợp',
      active: true,
      position: 2,
    },
  });
  console.log('✅ TikTok videos created');

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
