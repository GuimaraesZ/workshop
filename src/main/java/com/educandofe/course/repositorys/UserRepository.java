package com.educandofe.course.repositorys;
import org.springframework.data.jpa.repository.JpaRepository;

import com.educandofe.course.Model.UserModel;

public interface UserRepository  extends JpaRepository<UserModel, Long> {
    
}
