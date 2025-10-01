package com.educandofe.course.config;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.educandofe.course.repositorys.OrderRepository;
import com.educandofe.course.repositorys.UserRepository;
import com.educandofe.course.Model.OrderModel;
import com.educandofe.course.Model.UserModel;
import com.educandofe.course.repositorys.CategoryRepository;
import com.educandofe.course.Model.CategoryModel;


import org.springframework.boot.CommandLineRunner;

import com.educandofe.course.Model.Enums.OrderStatus;
import com.educandofe.course.repositorys.ProductRepository;
import com.educandofe.course.Model.ProductModel;
import com.educandofe.course.Model.OrderItemModel;
import com.educandofe.course.repositorys.OrderItemRepository;
import com.educandofe.course.Model.PaymentsModel;



@Configuration
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
        CategoryModel cat1 = new CategoryModel(null, "Electronics");
        CategoryModel cat2 = new CategoryModel(null, "Books");
        CategoryModel cat3 = new CategoryModel(null, "Computers");

        categoryRepository.saveAll(Arrays.asList(cat1, cat2, cat3));

        // Criar produtos
        ProductModel p1 = new ProductModel(null, "The Lord of the Rings", "Lorem ipsum dolor sit amet, consectetur.", 90.5, "");
        ProductModel p2 = new ProductModel(null, "Smart TV", "Nulla eu imperdiet purus. Maecenas ante.", 2190.0, "");
        ProductModel p3 = new ProductModel(null, "Macbook Pro", "Nam eleifend maximus tortor, at mollis.", 1250.0, "");
        ProductModel p4 = new ProductModel(null, "PC Gamer", "Donec aliquet odio ac rhoncus cursus.", 1200.0, "");
        ProductModel p5 = new ProductModel(null, "Rails for Dummies", "Cras fringilla convallis sem vel faucibus.", 100.99, "");

        productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

         p1.getCategories().add(cat2);
         p2.getCategories().add(cat1);
         p2.getCategories().add(cat3);
         p3.getCategories().add(cat3);
         p4.getCategories().add(cat3);
         p5.getCategories().add(cat2);
         productRepository.saveAll(Arrays.asList(p1, p2, p3, p4, p5));

       // criar e salvar os usuários
       UserModel u1 = new UserModel(null, "John Doe", "john@gmail.com", "123456789", "123456");
       UserModel u2 = new UserModel(null, "Maria Silva", "maria@gmail.com", "987654321", "654321");
       UserModel u3 = new UserModel(null, "Pedro Santos", "pedro@gmail.com", "555666777", "789123");
       UserModel u4 = new UserModel(null, "Ana Costa", "ana@gmail.com", "111222333", "321654");

       userRepository.saveAll(Arrays.asList(u1, u2, u3, u4));

       // Depois, criar os pedidos usando os usuários
       OrderModel o1 = new OrderModel(null, LocalDateTime.of(2019, 6, 20, 16, 53),OrderStatus.PAID, u1);
       OrderModel o2 = new OrderModel(null, LocalDateTime.of(2019, 7, 21, 3, 42),OrderStatus.DELIVERED, u2);
       OrderModel o3 = new OrderModel(null, LocalDateTime.of(2019, 7, 22, 15, 21),OrderStatus.WAITING_PAYMENT, u1);
       OrderModel o4 = new OrderModel(null, LocalDateTime.of(2019, 7, 23, 19, 15),OrderStatus.CANCELED, u3);

       orderRepository.saveAll(Arrays.asList(o1, o2, o3, o4));

        OrderItemModel oi1 = new OrderItemModel(o1, p1, 2, p1.getPrice());
        OrderItemModel oi2 = new OrderItemModel(o1, p3, 1, p3.getPrice());
        OrderItemModel oi3 = new OrderItemModel(o2, p4, 2, p4.getPrice());
        OrderItemModel oi4 = new OrderItemModel(o3, p5, 2, p5.getPrice());
        OrderItemModel oi5 = new OrderItemModel(o4, p2, 2, p2.getPrice());

       orderItemRepository.saveAll(Arrays.asList(oi1, oi2, oi3, oi4, oi5));

       PaymentsModel pay1 = new PaymentsModel(null, LocalDateTime.of(2019, 6, 22, 18, 53), o1);
       o1.setPayment(pay1);
       orderRepository.save(o1);
   }

}