(module $Mem
  (memory (export "shared") 1 1 shared)
)
(register "mem")

(thread $T1 (shared (module $Mem))
  (register "mem" $Mem)
  (module
    (memory (import "mem" "shared") 1 1 shared)
    (func (export "run")
      (i32.atomic.store (i32.const 0) (i32.const 1))
    )
  )
  (invoke "run")
)


(wait $T1)

(module $Check
  (memory (import "mem" "shared") 1 1 shared)

  (func (export "check") (result i32)
    (i32.load (i32.const 0))

    ;; allowed results: (L_0 = 1 && L_1 = 1) || (L_0 = 0 && L_1 = 1) || (L_0 = 1 && L_1 = 0)

    ;; (i32.and (i32.eq (local.get 0) (i32.const 1)) (i32.eq (local.get 1) (i32.const 1)))
    ;; (i32.and (i32.eq (local.get 0) (i32.const 0)) (i32.eq (local.get 1) (i32.const 1)))
    ;; (i32.and (i32.eq (local.get 0) (i32.const 1)) (i32.eq (local.get 1) (i32.const 0)))
    ;; (i32.or)
    ;; (i32.or)
    (return)
  )
)

(assert_return (invoke $Check "check") (i32.const 1))
