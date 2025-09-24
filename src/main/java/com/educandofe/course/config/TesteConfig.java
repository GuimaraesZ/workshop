/*package com.educandofe.course.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;

import com.educandofe.course.repositorys.UserRepository;
import com.educandofe.course.Model.UserModel;

import org.springframework.boot.CommandLineRunner;


@Configuration
public class TesteConfig  implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;

    @Override
    public void run(String... args) throws Exception {
        // Criar usuários de teste
        UserModel user1 = new UserModel(null, "John Doe", "john.doe@example.com", "1234567890", "@123");
        UserModel user2 = new UserModel(null, "Maria Silva", "maria@gmail.com", "999999999", "123456");
        UserModel user3 = new UserModel(null, "Pedro Santos", "pedro@email.com", "888888888", "senha123");
        
        userRepository.saveAll(Arrays.asList(user1, user2, user3));
    }



    
}
*/