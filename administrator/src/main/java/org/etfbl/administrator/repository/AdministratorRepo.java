package org.etfbl.administrator.repository;

import org.etfbl.administrator.model.Administrator;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdministratorRepo extends JpaRepository<Administrator, String> {

}
