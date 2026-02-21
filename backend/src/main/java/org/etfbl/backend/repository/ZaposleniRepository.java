package org.etfbl.backend.repository;

import org.etfbl.backend.model.ZaposleniEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ZaposleniRepository extends JpaRepository<ZaposleniEntity,String> {
}
