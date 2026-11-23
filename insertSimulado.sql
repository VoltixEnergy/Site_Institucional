INSERT INTO alerta (id, metrica_id, prioridade, tipo, descricao, criado_em, enviado_em) VALUES
-- ==========================================
-- AGOSTO 2026 (CPU, RAM, Disco, Download, Upload)
-- ==========================================
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 1, 'Abaixo do limite mínimo', 'Uso de CPU abaixo do mínimo esperado', '2026-08-02 09:10:00', '2026-08-02 09:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 1, 'Abaixo do limite mínimo', 'Uso de RAM abaixo do mínimo esperado', '2026-08-05 11:20:00', '2026-08-05 11:20:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 1, 'Abaixo do limite mínimo', 'Leitura de disco ociosa', '2026-08-08 14:00:00', '2026-08-08 14:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c72', 1, 'Abaixo do limite mínimo', 'Taxa de download muito baixa', '2026-08-11 16:30:00', '2026-08-11 16:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c71', 1, 'Abaixo do limite mínimo', 'Taxa de upload muito baixa', '2026-08-14 08:45:00', '2026-08-14 08:45:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU atingiu 82%', '2026-08-17 13:15:00', '2026-08-17 13:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'Memória RAM atingiu 85%', '2026-08-19 15:40:00', '2026-08-19 15:40:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'Sobrecarga de CPU (96%)', '2026-08-21 10:05:00', '2026-08-21 10:05:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'Memória RAM crítica (95%)', '2026-08-23 11:50:00', '2026-08-23 11:50:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 3, 'Acima do limite máximo', 'Disco rígido acima de 92%', '2026-08-25 17:25:00', '2026-08-25 17:25:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'Estouro de memória RAM (98%)', '2026-08-28 19:10:00', '2026-08-28 19:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'Pico de CPU (99%)', '2026-08-30 21:00:00', '2026-08-30 21:00:00'),

-- ==========================================
-- SETEMBRO 2026
-- ==========================================
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 1, 'Abaixo do limite mínimo', 'CPU em baixa atividade', '2026-09-02 08:00:00', '2026-09-02 08:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 1, 'Abaixo do limite mínimo', 'RAM em baixa alocação', '2026-09-05 09:30:00', '2026-09-05 09:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 1, 'Abaixo do limite mínimo', 'Uso de disco reduzido', '2026-09-07 10:45:00', '2026-09-07 10:45:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU em 81%', '2026-09-10 14:20:00', '2026-09-10 14:20:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 84%', '2026-09-12 15:10:00', '2026-09-12 15:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 2, 'Próximo ao limite máximo', 'Disco atingiu 83%', '2026-09-15 16:00:00', '2026-09-15 16:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c72', 2, 'Próximo ao limite máximo', 'Download próximo ao limite de banda', '2026-09-18 11:35:00', '2026-09-18 11:35:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c71', 2, 'Próximo ao limite máximo', 'Upload próximo ao limite de banda', '2026-09-21 12:50:00', '2026-09-21 12:50:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 88%', '2026-09-24 18:15:00', '2026-09-24 18:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'CPU atingiu 94%', '2026-09-27 20:40:00', '2026-09-27 20:40:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'RAM atingiu 96%', '2026-09-29 22:05:00', '2026-09-29 22:05:00'),

-- ==========================================
-- OUTUBRO 2026 (Distribuído ao longo dos dias do mês)
-- ==========================================
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 83%', '2026-10-01 09:00:00', '2026-10-01 09:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU em 80%', '2026-10-01 14:30:00', '2026-10-01 14:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 86%', '2026-10-02 10:15:00', '2026-10-02 10:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 2, 'Próximo ao limite máximo', 'Disco em 85%', '2026-10-02 11:20:00', '2026-10-02 11:20:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'CPU em 95%', '2026-10-02 16:45:00', '2026-10-02 16:45:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c72', 1, 'Abaixo do limite mínimo', 'Download abaixo do esperado', '2026-10-03 08:30:00', '2026-10-03 08:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 87%', '2026-10-04 13:10:00', '2026-10-04 13:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU em 84%', '2026-10-05 15:00:00', '2026-10-05 15:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'RAM em 97%', '2026-10-06 09:40:00', '2026-10-06 09:40:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 2, 'Próximo ao limite máximo', 'Disco em 88%', '2026-10-06 17:20:00', '2026-10-06 17:20:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c71', 2, 'Próximo ao limite máximo', 'Upload elevado', '2026-10-08 11:05:00', '2026-10-08 11:05:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 89%', '2026-10-10 14:50:00', '2026-10-10 14:50:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'CPU em 98%', '2026-10-13 10:00:00', '2026-10-13 10:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'RAM em 96%', '2026-10-13 12:30:00', '2026-10-13 12:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 3, 'Acima do limite máximo', 'Disco em 95%', '2026-10-13 16:15:00', '2026-10-13 16:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c72', 2, 'Próximo ao limite máximo', 'Download em 890 Kb/s', '2026-10-16 09:25:00', '2026-10-16 09:25:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 85%', '2026-10-20 14:10:00', '2026-10-20 14:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 1, 'Abaixo do limite mínimo', 'CPU ociosa', '2026-10-24 03:00:00', '2026-10-24 03:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 84%', '2026-10-28 18:40:00', '2026-10-28 18:40:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 2, 'Próximo ao limite máximo', 'Disco em 86%', '2026-10-31 20:15:00', '2026-10-31 20:15:00'),

-- ==========================================
-- NOVEMBRO 2026 (Dias 1, 2 e 3)
-- ==========================================
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 2, 'Próximo ao limite máximo', 'RAM em 82%', '2026-11-01 08:15:00', '2026-11-01 08:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU em 81%', '2026-11-01 11:40:00', '2026-11-01 11:40:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 2, 'Próximo ao limite máximo', 'Disco em 80%', '2026-11-01 16:20:00', '2026-11-01 16:20:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c72', 2, 'Próximo ao limite máximo', 'Download elevado', '2026-11-02 10:05:00', '2026-11-02 10:05:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'RAM em 94%', '2026-11-03 09:10:00', '2026-11-03 09:10:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 3, 'Acima do limite máximo', 'CPU em 93%', '2026-11-03 10:30:00', '2026-11-03 10:30:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c70', 3, 'Acima do limite máximo', 'Disco em 91%', '2026-11-03 12:00:00', '2026-11-03 12:00:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c71', 3, 'Acima do limite máximo', 'Upload saturado', '2026-11-03 14:45:00', '2026-11-03 14:45:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c68', 3, 'Acima do limite máximo', 'RAM crítica (97%)', '2026-11-03 17:15:00', '2026-11-03 17:15:00'),
(UUID(), 'f5ae3d95-02da-49f6-ba72-4a3913bb6c67', 2, 'Próximo ao limite máximo', 'CPU em 85%', '2026-11-03 19:50:00', '2026-11-03 19:50:00');

/*SELECT 
    c.tipo AS componente,
    e.nome AS especificacao,
    a.tipo AS tipo_alerta,
    MONTHNAME(a.criado_em) AS mes,
    COUNT(a.id) AS total_alertas
FROM usuario u
JOIN empresa emp ON u.empresa_id = emp.id
JOIN instancia i ON i.empresa_id = emp.id
JOIN metrica m ON m.instancia_id = i.id
JOIN especificacao e ON m.especificacao_id = e.id
JOIN componente c ON e.componente_id = c.id
JOIN alerta a ON a.metrica_id = m.id
WHERE u.email = 'adm@voltix.com'
GROUP BY c.tipo, e.nome, a.tipo, MONTHNAME(a.criado_em)
ORDER BY mes, componente;
*/