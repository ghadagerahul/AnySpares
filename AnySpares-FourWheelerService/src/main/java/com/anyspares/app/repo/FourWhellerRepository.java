package com.anyspares.app.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.anyspares.app.entity.Entity;


@Repository
public interface FourWhellerRepository extends JpaRepository<Entity, Long> {

}
