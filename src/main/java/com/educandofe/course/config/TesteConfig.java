package com.educandofe.course.config;

import java.time.LocalDateTime;
import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.educandofe.course.repositorys.OrderRepository;
import com.educandofe.course.repositorys.UserRepository;
import com.educandofe.course.Model.OrderModel;
import com.educandofe.course.Model.UserModel;

import org.springframework.boot.CommandLineRunner;


@Configuration
public class TesteConfig  implements CommandLineRunner {
    
   @Autowired
   private OrderRepository orderRepository;
   
   @Autowired
   private UserRepository userRepository;

   @Override
   public void run(String... args) throws Exception {
       // Primeiro, criar e salvar os usuários
       UserModel u1 = new UserModel(null, "John Doe", "john@gmail.com", "123456789", "123456");
       UserModel u2 = new UserModel(null, "Maria Silva", "maria@gmail.com", "987654321", "654321");
       UserModel u3 = new UserModel(null, "Pedro Santos", "pedro@gmail.com", "555666777", "789123");
       
       userRepository.saveAll(Arrays.asList(u1, u2, u3));
       
       // Depois, criar os pedidos usando os usuários
       OrderModel o1 = new OrderModel(null, LocalDateTime.of(2019, 6, 20, 16, 53), u1);
       OrderModel o2 = new OrderModel(null, LocalDateTime.of(2019, 7, 21, 3, 42), u2);
       OrderModel o3 = new OrderModel(null, LocalDateTime.of(2019, 7, 22, 15, 21), u1);

       orderRepository.saveAll(Arrays.asList(o1, o2, o3));
   }

}