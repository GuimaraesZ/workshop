package com.educandofe.course.config;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;

import com.educandofe.course.Model.category.CategoryModel;
import com.educandofe.course.Model.common.Enums.OrderStatus;
import com.educandofe.course.Model.order.OrderItemModel;
import com.educandofe.course.Model.order.OrderModel;
import com.educandofe.course.Model.payment.PaymentsModel;
import com.educandofe.course.Model.product.ProductModel;
import com.educandofe.course.Model.user.UserModel;
import com.educandofe.course.repositorys.category.CategoryRepository;
import com.educandofe.course.repositorys.order.OrderItemRepository;
import com.educandofe.course.repositorys.order.OrderRepository;
import com.educandofe.course.repositorys.product.ProductRepository;
import com.educandofe.course.repositorys.user.UserRepository;



@Configuration
@Profile("test")
public class TesteConfig  implements CommandLineRunner {
    
   @Autowired
   private OrderRepository orderRepository;
   
   @Autowired
   private UserRepository userRepository;

   @Autowired
   private CategoryRepository categoryRepository;

   @Autowired
   private ProductRepository productRepository;

   @Autowired
   private OrderItemRepository orderItemRepository;

   @Override
   public void run(String... args) throws Exception {

        // Criar categorias
        CategoryModel cat1 = new CategoryModel(null, "Perfumes");
        CategoryModel cat2 = new CategoryModel(null, "Masculino");
        CategoryModel cat3 = new CategoryModel(null, "Feminino");

        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));
        System.out.println("✓ Categorias criadas: Perfumes, Masculino, Feminino");

        // Criar produtos - 22 PERFUMES DO BOTICÁRIO COM IMAGENS
        System.out.println("🌸 Criando 22 produtos do Boticário com imagens...");
        
        // Linha Malbec (4 produtos)
        ProductModel p1 = new ProductModel(null, "Malbec Clássico", "Eau de Toilette masculina com notas amadeiradas e especiarias.", 139.90, "/uploads/products/89d4caad-9a52-440e-9e68-6b90af9be9f8.webp");
        ProductModel p2 = new ProductModel(null, "Malbec Gold", "Fragrância premium com toque dourado e sofisticado.", 189.90, "/uploads/products/49ffba51-dcf3-4aec-9b66-7eec756fe0ee.webp");
        ProductModel p3 = new ProductModel(null, "Malbec Black", "Intensidade máxima com notas profundas e marcantes.", 159.90, "/uploads/products/74e2cd6d-f989-4dd1-9aee-8e2d21bb6607.webp");
        ProductModel p4 = new ProductModel(null, "Malbec Ultra Blue", "Frescor e elegância em uma única fragrância.", 149.90, "/uploads/products/fc35eecf-a47c-4358-bf6f-84e091112b60.webp");
        
        // Linha Egeo (3 produtos)
        ProductModel p5 = new ProductModel(null, "Egeo Blue", "Desodorante colônia masculino com frescor intenso.", 89.90, "/uploads/products/d5f352f3-9fc7-4f3f-9186-cbe37f11a9df.webp");
        ProductModel p6 = new ProductModel(null, "Egeo Dolce", "Fragrância feminina doce e envolvente.", 79.90, "/uploads/products/05c59698-8dd1-441a-8800-44f2cfc18b21.webp");
        ProductModel p7 = new ProductModel(null, "Egeo Choc", "Perfume feminino com notas de chocolate branco.", 79.90, "/uploads/products/dccf87ba-891e-4d3d-9b46-319d7a10f770.webp");
        
        // Linha Lily (1 produto)
        ProductModel p8 = new ProductModel(null, "Lily Eau de Parfum", "Sofisticação e elegância em um perfume feminino clássico.", 169.90, "/uploads/products/34c27dcc-cc74-453f-817a-f692a449b971.jpg");
        
        // Linha Coffee (2 produtos)
        ProductModel p9 = new ProductModel(null, "Coffee Man", "Fragrância masculina com notas de café e especiarias.", 129.90, "/uploads/products/82b6c7b2-8f6c-450f-a3be-829b05f6040e.webp");
        ProductModel p10 = new ProductModel(null, "Coffee Woman", "Perfume feminino com doçura de café e baunilha.", 129.90, "/uploads/products/c18985a1-6334-4823-aba3-6921fc97d943.webp");
        
        // Linha Quasar (2 produtos)
        ProductModel p11 = new ProductModel(null, "Quasar Evolution", "Fragrância masculina moderna e tecnológica.", 119.90, "/uploads/products/0cc0a892-1f32-403b-b910-4b16431f71e3.webp");
        ProductModel p12 = new ProductModel(null, "Quasar Brave", "Coragem e determinação em um perfume masculino.", 119.90, "/uploads/products/bd20556d-4deb-4dad-bb3a-fdaca8ba11a0.jpg");
        
        // Linha Cuide-se Bem (2 produtos)
        ProductModel p13 = new ProductModel(null, "Cuide-se Bem Deleite", "Body splash feminino com fragrância adocicada.", 59.90, "/uploads/products/09e1ddc4-666b-41a6-8556-dbec8cf40b66.jpeg");
        ProductModel p14 = new ProductModel(null, "Cuide-se Bem Encanto", "Hidratante perfumado com aroma floral.", 54.90, "/uploads/products/f4d1d8c4-f44b-402f-b2b0-a46fb3c25571.webp");
        
        // Linha Nativa SPA (2 produtos)
        ProductModel p15 = new ProductModel(null, "Nativa SPA Ameixa", "Desodorante colônia com fragrância de ameixa.", 89.90, "/uploads/products/a2d20d9c-e744-4e2a-af2c-53356e63ee54.jpg");
        ProductModel p16 = new ProductModel(null, "Nativa SPA Quinoa", "Perfume feminino nutritivo com toque de quinoa.", 89.90, "/uploads/products/eea3c43b-c85c-4a5e-9955-59e1408a123e.webp");
        
        // Linha Floratta (2 produtos)
        ProductModel p17 = new ProductModel(null, "Floratta Rose", "Eau de Toilette feminina com notas de rosas.", 139.90, "/uploads/products/116819aa-773c-47fe-a5e4-d0672d4c88de.webp");
        ProductModel p18 = new ProductModel(null, "Floratta Blue", "Fragrância floral azul com toque refrescante.", 139.90, "/uploads/products/6800f718-249a-466b-bd08-409728aa8382.webp");
        
        // Linha Premium (2 produtos)
        ProductModel p19 = new ProductModel(null, "Glamour Secrets Black", "Perfume feminino de luxo com notas orientais.", 199.90, "/uploads/products/399698fc-9e95-4047-9e71-3b60ff1d219e.jpeg");
        ProductModel p20 = new ProductModel(null, "Portinari Pour Homme", "Fragrância masculina sofisticada e elegante.", 219.90, "/uploads/products/f6240ba1-029f-4b4a-a592-b3a372d02c21.jpg");
        
        // Linha Exclusiva (2 produtos)
        ProductModel p21 = new ProductModel(null, "Iris Absolu", "Eau de Parfum com íris e especiarias raras.", 249.90, "/uploads/products/cb4563a9-8eb9-4b4d-abf2-7a6cbd7b48bd.jpg");
        ProductModel p22 = new ProductModel(null, "Rose Intense", "Perfume feminino intenso com rosas búlgaras.", 269.90, "/uploads/products/563ec2bd-a80d-4d42-939c-89133716a578.png");

        productRepository.saveAll(Arrays.asList(
            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
            p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
            p21, p22
        ));

        // Associar categorias aos produtos
        // Masculinos
        p1.getCategories().add(cat1); p1.getCategories().add(cat2);
        p2.getCategories().add(cat1); p2.getCategories().add(cat2);
        p3.getCategories().add(cat1); p3.getCategories().add(cat2);
        p4.getCategories().add(cat1); p4.getCategories().add(cat2);
        p5.getCategories().add(cat1); p5.getCategories().add(cat2);
        p9.getCategories().add(cat1); p9.getCategories().add(cat2);
        p11.getCategories().add(cat1); p11.getCategories().add(cat2);
        p12.getCategories().add(cat1); p12.getCategories().add(cat2);
        p20.getCategories().add(cat1); p20.getCategories().add(cat2);
        
        // Femininos
        p6.getCategories().add(cat1); p6.getCategories().add(cat3);
        p7.getCategories().add(cat1); p7.getCategories().add(cat3);
        p8.getCategories().add(cat1); p8.getCategories().add(cat3);
        p10.getCategories().add(cat1); p10.getCategories().add(cat3);
        p13.getCategories().add(cat1); p13.getCategories().add(cat3);
        p14.getCategories().add(cat1); p14.getCategories().add(cat3);
        p15.getCategories().add(cat1); p15.getCategories().add(cat3);
        p16.getCategories().add(cat1); p16.getCategories().add(cat3);
        p17.getCategories().add(cat1); p17.getCategories().add(cat3);
        p18.getCategories().add(cat1); p18.getCategories().add(cat3);
        p19.getCategories().add(cat1); p19.getCategories().add(cat3);
        p21.getCategories().add(cat1); p21.getCategories().add(cat3);
        p22.getCategories().add(cat1); p22.getCategories().add(cat3);
        
        productRepository.saveAll(Arrays.asList(
            p1, p2, p3, p4, p5, p6, p7, p8, p9, p10,
            p11, p12, p13, p14, p15, p16, p17, p18, p19, p20,
            p21, p22
        ));
        System.out.println("✓ 22 produtos do Boticário criados com sucesso!");

       // criar e salvar os usuários com dados completos
       System.out.println("👥 Criando usuários de teste com dados completos...");
       
       UserModel u1 = new UserModel(
           null, 
           "Rosy Silva", 
           "rosy@lojadrosy.com", 
           "(11) 98765-4321", 
           "123456",
           "🛍️ Loja da Rosy",
           "1985-03-15",
           "Rua das Flores",
           "123",
           "Jardim Primavera",
           "Apto 45",
           "São Paulo",
           "SP",
           "01234-567"
       );
       
       UserModel u2 = new UserModel(
           null, 
           "Maria Oliveira", 
           "maria@gmail.com", 
           "(11) 98876-5432", 
           "654321",
           "🌸 Perfumes da Maria",
           "1990-07-22",
           "Av. Paulista",
           "1000",
           "Bela Vista",
           "Conjunto 12",
           "São Paulo",
           "SP",
           "01310-100"
       );
       
       UserModel u3 = new UserModel(
           null, 
           "Pedro Santos", 
           "pedro@gmail.com", 
           "(21) 97765-4321", 
           "789123",
           "💼 Distribuidora Pedro",
           "1988-11-30",
           "Rua do Comércio",
           "456",
           "Centro",
           null,
           "Rio de Janeiro",
           "RJ",
           "20040-020"
       );
       
       UserModel u4 = new UserModel(
           null, 
           "Ana Costa", 
           "ana@gmail.com", 
           "(11) 96654-3210", 
           "321654",
           "✨ Beleza & Estilo",
           "1995-05-18",
           "Rua Augusta",
           "789",
           "Consolação",
           "Loja 3",
           "São Paulo",
           "SP",
           "01305-000"
       );

       userRepository.saveAll(Arrays.asList(u1, u2, u3, u4));
       System.out.println("✓ 4 usuários de teste criados com dados completos");

       // Depois, criar os pedidos usando os usuários e produtos do Boticário
       OrderModel o1 = new OrderModel(null, LocalDateTime.now().minusDays(10), OrderStatus.PAID, u1);
       OrderModel o2 = new OrderModel(null, LocalDateTime.now().minusDays(5), OrderStatus.DELIVERED, u2);
       OrderModel o3 = new OrderModel(null, LocalDateTime.now().minusDays(2), OrderStatus.WAITING_PAYMENT, u1);
       OrderModel o4 = new OrderModel(null, LocalDateTime.now().minusDays(1), OrderStatus.CANCELED, u3);

       orderRepository.saveAll(Arrays.asList(o1, o2, o3, o4));

        OrderItemModel oi1 = new OrderItemModel(o1, p1, 2, p1.getPrice()); // 2x Malbec Clássico
        OrderItemModel oi2 = new OrderItemModel(o1, p8, 1, p8.getPrice()); // 1x Lily
        OrderItemModel oi3 = new OrderItemModel(o2, p5, 1, p5.getPrice()); // 1x Egeo Blue
        OrderItemModel oi4 = new OrderItemModel(o3, p13, 3, p13.getPrice()); // 3x Cuide-se Bem
        OrderItemModel oi5 = new OrderItemModel(o4, p19, 1, p19.getPrice()); // 1x Glamour Secrets

       orderItemRepository.saveAll(Arrays.asList(oi1, oi2, oi3, oi4, oi5));

       PaymentsModel pay1 = new PaymentsModel(null, LocalDateTime.now().minusDays(9), o1);
       o1.setPayment(pay1);
       orderRepository.save(o1);
       
       System.out.println("✓ Pedidos de teste criados");
       System.out.println("====================================");
       System.out.println("🎉 DATABASE INICIALIZADO COM SUCESSO!");
       System.out.println("====================================");
   }

}