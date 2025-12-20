/**
 * Script để cập nhật URL ảnh trong database từ .jpg/.png sang .webp
 */

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const path = require('path');

const prisma = new PrismaClient();

async function updateImageUrls() {
  try {
    console.log('🔄 Updating image URLs in database...\n');

    // Cập nhật ProductImage
    const productImages = await prisma.productImage.findMany({
      where: {
        url: {
          not: {
            contains: '.webp',
          },
        },
      },
    });

    console.log(`📸 Found ${productImages.length} product images to update`);

    let updated = 0;
    for (const img of productImages) {
      const oldUrl = img.url;
      // Thay đổi extension sang .webp
      let newUrl = oldUrl;
      
      // Nếu là .jpg, .jpeg, .png, .gif → đổi sang .webp
      newUrl = newUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
      
      if (newUrl !== oldUrl) {
        await prisma.productImage.update({
          where: { id: img.id },
          data: { url: newUrl },
        });
        console.log(`   ✅ ${oldUrl} → ${newUrl}`);
        updated++;
      }
    }

    // Cập nhật Category imageUrl
    const categories = await prisma.category.findMany({});

    console.log(`\n📁 Found ${categories.length} categories`);
    for (const cat of categories) {
      if (cat.imageUrl && !cat.imageUrl.includes('.webp')) {
        const newUrl = cat.imageUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        await prisma.category.update({
          where: { id: cat.id },
          data: { imageUrl: newUrl },
        });
        console.log(`   ✅ Category ${cat.name}: ${cat.imageUrl} → ${newUrl}`);
        updated++;
      }
    }

    // Cập nhật Brand imageUrl
    const brands = await prisma.brand.findMany({});

    console.log(`\n🏷️  Found ${brands.length} brands`);
    for (const brand of brands) {
      if (brand.imageUrl && !brand.imageUrl.includes('.webp')) {
        const newUrl = brand.imageUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        await prisma.brand.update({
          where: { id: brand.id },
          data: { imageUrl: newUrl },
        });
        console.log(`   ✅ Brand ${brand.name}: ${brand.imageUrl} → ${newUrl}`);
        updated++;
      }
    }

    // Cập nhật Banner imageUrl
    const banners = await prisma.banner.findMany({});

    console.log(`\n🖼️  Found ${banners.length} banners`);
    for (const banner of banners) {
      if (banner.imageUrl && !banner.imageUrl.includes('.webp')) {
        const newUrl = banner.imageUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        await prisma.banner.update({
          where: { id: banner.id },
          data: { imageUrl: newUrl },
        });
        console.log(`   ✅ Banner ${banner.id}: ${banner.imageUrl} → ${newUrl}`);
        updated++;
      }
    }

    // Cập nhật BlogPost coverUrl
    const blogPosts = await prisma.blogPost.findMany({});

    console.log(`\n📝 Found ${blogPosts.length} blog posts`);
    for (const post of blogPosts) {
      if (post.coverUrl && !post.coverUrl.includes('.webp')) {
        const newUrl = post.coverUrl.replace(/\.(jpg|jpeg|png|gif)$/i, '.webp');
        await prisma.blogPost.update({
          where: { id: post.id },
          data: { coverUrl: newUrl },
        });
        console.log(`   ✅ Blog ${post.title}: ${post.coverUrl} → ${newUrl}`);
        updated++;
      }
    }

    console.log(`\n✅ Updated ${updated} image URLs in database`);
    console.log('\n💡 Note: Frontend will automatically use WebP version via getImageUrl() helper');
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateImageUrls();

